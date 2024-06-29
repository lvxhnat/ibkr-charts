import asyncio
import xmltodict
from datetime import datetime
from typing import List, Optional
from starlette.websockets import WebSocketState
from ib_insync import ContractDetails, Contract, Forex
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.contracts import (
    serialise_contractdetails,
    SerialisedContractDetails,
    serialise_tickerdata,
)
from backend.app.api.clients.ibkr.search import conid_mongodb

from backend.app.api.endpoints.contract.models import TickerInfoDTO
from backend.app.api.endpoints.contract.params import (
    HistoricalPriceType,
    HistoricalDurationType,
    HistoricalIntervalType,
)

tag = "contract"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.get("/{contractId}/info")
async def get_ticker_info(contractId: str) -> TickerInfoDTO:
    contract: Contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    contract_details: List[ContractDetails] = await ibkr_client.reqContractDetailsAsync(contract)
    contract_details: SerialisedContractDetails = await serialise_contractdetails(
        contract_details[0]
    )
    contract_details["symbol"] = contract.symbol
    contract_details["contract_id"] = contract.conId
    contract_details["exchange"] = contract.exchange
    contract_details["currency"] = contract.currency
    contract_details["asset_type"] = contract.secType
    return contract_details


@router.get("/{contractId}/metadata")
async def get_ticker_metadata(contractId: str):
    contract: Contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    report_snapshot = await ibkr_client.reqFundamentalDataAsync(contract, "ReportSnapshot")

    if not report_snapshot:
        return []

    parsed_snapshot = xmltodict.parse(report_snapshot)
    text_info = parsed_snapshot["ReportSnapshot"]["TextInfo"]["Text"]
    data = {}
    for entry in text_info:
        data[entry["@Type"].lower().strip().replace(" ", "_")] = {
            "last_modified": entry["@lastModified"],
            "text": entry["#text"],
        }
    return data


@router.get("/{contractId}/historical")
async def get_ticker_historical(
    contractId: str,
    duration: Optional[HistoricalDurationType] = "30 D",
    interval: Optional[HistoricalIntervalType] = "1 hour",
    price_type: Optional[HistoricalPriceType] = "MIDPOINT",
    end_date: Optional[datetime | str] = "",
):
    contract_details = conid_mongodb(contractId)
    if contract_details and contract_details["type"] == "IND":
        # https://groups.io/g/twsapi/topic/4047801
        price_type = "TRADES"
    if contract_details and contract_details["type"] == "CASH":
        contract = Forex(pair=contract_details["localSymbol"].replace(".", ""))
    else:
        contract = Contract(conId=contractId)
        await ibkr_client.qualifyContractsAsync(contract)
    data = await ibkr_client.reqHistoricalDataAsync(
        contract,
        endDateTime=end_date,
        barSizeSetting=interval,
        durationStr=duration,
        whatToShow=price_type,
        useRTH=True,
    )
    return data


@router.websocket("/{contractId}/price")
async def get_price_stream(
    contractId: str,
    websocket: WebSocket,
):

    await websocket.accept()

    def on_tick_update(tickers):
        for ticker in tickers:
            if ticker.contract.conId == int(contractId):
                asyncio.create_task(send_data(ticker))

    async def send_data(ticker):
        if websocket.application_state == WebSocketState.CONNECTED:
            data = await serialise_tickerdata(ticker, status="delayed")
            try:
                await websocket.send_json(data)
            except:
                print(f"Error occurred when sending price stream data in get_price_stream")

    contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)

    dividends, high_lows, last_prices = "456", "165", "233"
    request_types = ",".join([dividends, high_lows, last_prices])
    ticker = ibkr_client.reqMktData(contract, request_types)
    await asyncio.sleep(2)
    ibkr_client.pendingTickersEvent += on_tick_update
    await send_data(ticker)

    try:
        while True:
            await asyncio.sleep(10)  # Keep the connection alive
    except WebSocketDisconnect:
        print(f"{contract.symbol} Price Socket Disconnected")
    except RuntimeError as e:
        print(f"RuntimeError Encountered on {contract.symbol} Price Socket.")
    finally:
        print("Cleaning up {contract.symbol} Price Socket.")
        ibkr_client.cancelMktData(contract)
        ibkr_client.pendingTickersEvent -= on_tick_update


if __name__ == "__main__":
    ibkr_client.sync_connect()
    contract = Contract(conId=523014861)
    ibkr_client.qualifyContracts(contract)
    print(ibkr_client.reqFundamentalData(contract, "ReportSnapshot"))
