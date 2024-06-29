import math
from typing import Literal
from pydantic import BaseModel
from ib_insync import ContractDetails, Contract, Ticker
from backend.app.config.base_config import ibkr_client


async def parse_hours(hours):
    days_hours = hours.split(";")
    parsed_hours = {}
    for day_hour in days_hours:
        day, _, hours = day_hour.partition(":")
        if "CLOSED" in hours:
            parsed_hours[day] = "Closed"
        else:
            start, _, end = hours.partition("-")
            parsed_hours[day] = {
                "start": start,
                "end": end.replace(day + ":", ""),
            }

    return parsed_hours


class SerialisedContractDetails(BaseModel):
    long_name: str
    industry: str
    category: str
    sub_category: str
    time_zone: str
    trading_hours: dict
    liquid_hours: dict


async def serialise_contractdetails(
    contract_detail: ContractDetails,
) -> SerialisedContractDetails:
    return {
        "long_name": contract_detail.longName,
        "industry": contract_detail.industry,
        "category": contract_detail.category,
        "sub_category": contract_detail.subcategory,
        "time_zone": contract_detail.timeZoneId,
        "trading_hours": await parse_hours(contract_detail.tradingHours),
        "liquid_hours": await parse_hours(contract_detail.liquidHours),
    }


MarketStatus = Literal["live", "frozen", "delayed", "delayed frozen"]


async def serialise_tickerdata(ticker_data: Ticker, status: MarketStatus):

    response = {
        "status": "error",
        "last": None,
        "last_size": None,
        "last_bid": None,
        "last_bid_size": None,
        "last_ask": None,
        "last_ask_size": None,
        "dividends": None,
    }

    check_nan = lambda v: None if math.isnan(v) else v

    try:
        response["status"] = status
        response["last"] = (
            check_nan(ticker_data.close) if math.isnan(ticker_data.last) else ticker_data.last
        )
        response["last_size"] = check_nan(ticker_data.lastSize)
        response["last_bid"] = check_nan(ticker_data.bid)
        response["last_bid_size"] = check_nan(ticker_data.bidSize)
        response["last_ask"] = check_nan(ticker_data.ask)
        response["last_ask_size"] = check_nan(ticker_data.askSize)
        response["dividends"] = (
            {
                "past_12_months": ticker_data.dividends.past12Months,
                "next_12_months": ticker_data.dividends.past12Months,
                "next_date": (
                    ticker_data.dividends.nextDate.strftime("%Y-%m-%d")
                    if ticker_data.dividends.nextDate
                    else None
                ),
                "next_amount": ticker_data.dividends.nextAmount,
            }
            if ticker_data.dividends
            else None
        )
        return response

    except Exception as e:
        return response


if __name__ == "__main__":

    ibkr_client.sync_connect()
    contract = Contract(conId=265768)
    ibkr_client.qualifyContracts(contract)

    allowed_intervals = {
        "1D": "1 min",
        "5D": "10 mins",
        "1M": "30 mins",
        "6M": "1 day",
        "YTD": "1 day",
        "1Y": "1 day",
        "5Y": "1 day",
        "10Y": "1 week",
    }

    contract_details = ibkr_client.reqHistoricalData(
        contract,
        endDateTime="",
        durationStr="1 D",
        barSizeSetting="1 min",
        whatToShow="HISTORICAL_VOLATILITY",
        useRTH=True,
    )

    print(contract_details)
