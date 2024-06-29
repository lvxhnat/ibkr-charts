from enum import Enum
from ib_insync import MarketOrder, LimitOrder, StopLimitOrder

OrderTypes = {
    "MarketOrder": MarketOrder,
    "LimitOrder": LimitOrder,
    "StopLimitOrder": StopLimitOrder,
}


class SecurityType(Enum):
    STK = ("Stock (or ETF)",)
    OPT = ("Option",)
    FUT = ("Future",)
    IND = ("Index",)
    FOP = ("Futures option",)
    CASH = ("Forex pair",)
    CFD = ("CFD",)
    BAG = ("Combo",)
    WAR = ("Warrant",)
    BOND = ("Bond",)
    CMDTY = ("Commodity",)
    NEWS = ("News",)
    FUND = ("Mutual fund",)
    CRYPTO = ("Crypto currency",)
    EVENT = "Bet on an event"
