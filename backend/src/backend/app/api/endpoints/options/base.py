from typing import List
from fastapi import APIRouter
from ib_insync import Contract, OptionChain
from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.options import serialise_optionchain

tag = "options"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.get("/chain/{contractId}")
async def get_option_chains(contractId: int):
    contract: Contract = Contract(conId=contractId)
    await ibkr_client.qualifyContractsAsync(contract)
    symbol, secType = contract.symbol, contract.secType
    option_chain: List[OptionChain] = await ibkr_client.reqSecDefOptParamsAsync(
        symbol, "", secType, contractId
    )
    serialised_option_chain = await serialise_optionchain(option_chain)
    return serialised_option_chain


if __name__ == "__main__":
    from backend.app.config.base_config import ibkr_client

    ibkr_client.sync_connect()
    print(ibkr_client.reqSecDefOptParams("INDA", "", "STK", 101484826))
