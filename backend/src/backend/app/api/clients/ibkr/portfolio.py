from typing import List
from pydantic import BaseModel
from ib_insync import PortfolioItem, AccountValue
from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.models.portfolio import PortfolioAccountValue
from backend.app.api.clients.ibkr.config.requests import request_settings


class SerialisedPortfolioItem(BaseModel):
    contract_id: str
    symbol: str
    exchange: str
    currency: str
    position: int
    average_cost: float
    market_price: float
    market_value: float
    unrealised_pnl: float
    daily_pnl: float


async def serialise_portfolioitem(
    portfolio_item: PortfolioItem,
) -> SerialisedPortfolioItem:
    contract = portfolio_item.contract
    return {
        "contract_id": contract.conId,
        "symbol": contract.symbol,
        "exchange": contract.primaryExchange,
        "currency": contract.currency,
        "position": portfolio_item.position,
        "average_cost": portfolio_item.averageCost,
        "market_price": portfolio_item.marketPrice,
        "market_value": portfolio_item.marketValue,
        "unrealised_pnl": portfolio_item.unrealizedPNL,
    }


def account_rundowns() -> PortfolioAccountValue:

    account_values: List[AccountValue] = ibkr_client.accountValues()

    account_rundowns: PortfolioAccountValue = {}

    for account_value in account_values:

        currency: str = account_value.currency
        if account_value.tag not in request_settings.portfolio_required_fields:
            continue

        value = account_value.value
        if value:
            value = float(value)

        if account_value.tag in account_rundowns:
            account_rundowns[account_value.tag][currency] = value
        else:
            account_rundowns[account_value.tag] = {}
            if currency:
                account_rundowns[account_value.tag][currency] = value
            else:
                account_rundowns[account_value.tag] = value

    return account_rundowns


if __name__ == "__main__":
    ibkr_client.sync_connect()
    print(account_rundowns())
