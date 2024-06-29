import math
import asyncio
from typing import List
from fastapi import APIRouter, WebSocket
from ib_insync import PortfolioItem, PnLSingle, AccountValue
from starlette.websockets import WebSocketState, WebSocketDisconnect

from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.portfolio import (
    serialise_portfolioitem,
    SerialisedPortfolioItem,
    account_rundowns,
)
from backend.app.api.clients.ibkr.config.requests import request_settings

tag = "portfolio"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("/summary")
async def get_portfolio_values(websocket: WebSocket):
    await websocket.accept()
    account_rundown_info = account_rundowns()
    await websocket.send_json({"type": "initialise", "data": account_rundown_info})

    async def send_account_event(account_value: AccountValue):
        if (
            account_value.tag in request_settings.portfolio_required_fields
            and websocket.application_state == WebSocketState.CONNECTED
        ):
            currency: str = account_value.currency
            value = account_value.value
            if value:
                value = float(value)
            try:
                await websocket.send_json(
                    {
                        "type": "update",
                        "data": {
                            "tag": account_value.tag,
                            "currency": currency,
                            "value": value,
                        },
                    }
                )
            except:
                print(f"Connection to PortfolioSummary has closed while sending json packet.")

    ibkr_client.accountValueEvent += send_account_event
    ibkr_client.accountSummaryEvent += send_account_event

    try:
        while True:
            await asyncio.sleep(10)  # Keep the connection alive
    except WebSocketDisconnect:
        print("PortfolioValues Socket Disconnected")
    except RuntimeError:
        print(f"RuntimeError Encountered on PortfolioValues Socket.")
    finally:
        print("Cleaning up PortfolioValues Socket.")
        ibkr_client.accountValueEvent -= send_account_event
        ibkr_client.accountSummaryEvent -= send_account_event


@router.websocket("/holdings")
async def get_portfolio_holdings(websocket: WebSocket):
    """Use both .portfolio() with .reqPnLSingle() methods to update our events"""
    await websocket.accept()

    async def send_portfolio_event(portfolio_item: PortfolioItem):
        if websocket.application_state == WebSocketState.CONNECTED:
            if isinstance(portfolio_item, PortfolioItem):
                portfolio_item: SerialisedPortfolioItem = await serialise_portfolioitem(
                    portfolio_item
                )
            portfolio_items[portfolio_item["contract_id"]] = portfolio_item
            try:
                await websocket.send_json({"data": portfolio_item})
            except:
                print(f"Error encountered on send_portfolio_event")

    async def update_portfolio_event(pnl: PnLSingle):
        if websocket.application_state == WebSocketState.CONNECTED:
            contract_id = pnl.conId
            pnl_subscriptions[contract_id] = pnl  # Update existing PnL entry
            portfolio_items[contract_id]["daily_pnl"] = (
                None if math.isnan(pnl.dailyPnL) else pnl.dailyPnL
            )
            if not math.isnan(pnl.unrealizedPnL):
                portfolio_items[contract_id]["unrealised_pnl"] = pnl.unrealizedPnL
            if not math.isnan(pnl.value):
                portfolio_items[contract_id]["market_value"] = pnl.value
                portfolio_items[contract_id]["market_price"] = float(pnl.value) / float(
                    pnl.position
                )
            try:
                await websocket.send_json({"data": portfolio_items[contract_id]})
            except Exception as e:
                print(f"Error encountered on update_portfolio_event")
                print(str(e)[:500])

    # Get the account ids. We need this for checking existing subscriptions.
    accounts = ibkr_client.managedAccounts()
    await asyncio.sleep(2)
    # Use the first account, or adjust as necessary
    account = accounts[0]
    portfolio_items: dict = {}
    for portfolio_item in ibkr_client.portfolio():
        data = await serialise_portfolioitem(portfolio_item)
        portfolio_items[data["contract_id"]] = data

    # Get existing pnl subscriptions
    pnl_subscriptions: dict = {}
    existing_pnl_subscriptions: List[PnLSingle] = ibkr_client.pnlSingle(account=account)
    for pnl_single in existing_pnl_subscriptions:
        await update_portfolio_event(pnl_single)
        pnl_subscriptions[pnl_single.conId] = pnl_single

    # Subscribe to PnL for each portfolio item and send initial positions
    for contract_id, portfolio_item in portfolio_items.items():
        # Subscribe to P&L updates (modify according to how you want to handle subscriptions to avoid errors)
        await send_portfolio_event(portfolio_item)
        if contract_id not in pnl_subscriptions:
            try:
                pnl_sub: PnLSingle = ibkr_client.reqPnLSingle(account, "", contract_id)
                await update_portfolio_event(pnl_sub)
                pnl_subscriptions[contract_id] = pnl_sub
            except Exception:
                print(f"PnL Sub for conId {contract_id} already exists.")

    ibkr_client.updatePortfolioEvent += send_portfolio_event
    ibkr_client.pnlSingleEvent += update_portfolio_event

    try:
        while True:
            await asyncio.sleep(10)  # Keep the connection alive
    except WebSocketDisconnect:
        print("PortfolioHoldings Socket Disconnected")
    except RuntimeError:
        print(f"RuntimeError Encountered on PortfolioHoldings Socket.")
    finally:
        print("Cleaning up PortfolioHoldings Socket.")
        # Unsubscribe from P&L updates to clean up
        for pnl_sub in pnl_subscriptions.values():
            ibkr_client.cancelPnLSingle(pnl_sub)
        ibkr_client.updatePortfolioEvent -= send_portfolio_event


if __name__ == "__main__":
    ibkr_client.sync_connect()
