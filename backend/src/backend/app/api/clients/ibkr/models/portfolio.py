from pydantic import BaseModel


class CurrencyTypes(BaseModel):
    BASE: str
    SGD: str
    USD: str


class PortfolioAccountValue(BaseModel):
    AccruedDividend: CurrencyTypes
    AvailableFunds: CurrencyTypes
    BuyingPower: CurrencyTypes
    CashBalance: CurrencyTypes
    EquityWithLoanValue: CurrencyTypes
    ExcessLiquidity: CurrencyTypes
    GrossPositionValue: CurrencyTypes
    NetLiquidationByCurrency: CurrencyTypes
    TotalCashBalance: CurrencyTypes
    UnrealizedPnL: CurrencyTypes
