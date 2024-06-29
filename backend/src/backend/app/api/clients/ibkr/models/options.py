from typing import List, Dict
from pydantic import BaseModel


class _SerialisedExchangeOptionChain(BaseModel):
    multiplier: str
    strikes: List[float]
    expirations: List[str]


SerialisedOptionChain = Dict[str, _SerialisedExchangeOptionChain]
