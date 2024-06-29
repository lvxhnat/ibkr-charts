from typing import List
from ib_insync import OptionChain
from backend.app.api.clients.ibkr.models.options import SerialisedOptionChain


async def serialise_optionchain(option_chain: List[OptionChain]) -> SerialisedOptionChain:
    # Each element in option_chain is that from an exchange
    return {
        exchange_option_chain.exchange: {
            "multiplier": exchange_option_chain.multiplier,
            "strikes": list(exchange_option_chain.strikes),
            "expirations": list(exchange_option_chain.expirations),
        }
        for exchange_option_chain in option_chain
    }
