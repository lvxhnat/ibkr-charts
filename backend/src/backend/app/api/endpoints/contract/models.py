from backend.app.api.clients.ibkr.contracts import SerialisedContractDetails


class TickerInfoDTO(SerialisedContractDetails):
    symbol: str
    contract_id: int
    exchange: str
    currency: str
    asset_type: str
