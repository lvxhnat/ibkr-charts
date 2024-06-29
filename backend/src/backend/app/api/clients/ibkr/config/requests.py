from typing import List
from pydantic_settings import BaseSettings


class RequestSettings(BaseSettings):
    portfolio_required_fields: List[str] = [
        "AccruedDividend",
        "AvailableFunds",
        "BuyingPower",
        "CashBalance",
        "EquityWithLoanValue",
        "ExcessLiquidity",
        "GrossPositionValue",
        "NetLiquidationByCurrency",
        "TotalCashBalance",
        "UnrealizedPnL",
    ]


request_settings: RequestSettings = RequestSettings()
