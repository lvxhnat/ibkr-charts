from pydantic import BaseModel


class SerialisedOrder(BaseModel):
    contract_id: str
    symbol: str
    exchange: str
    currency: str
    order_id: str
    action: str
    total_quantity: str
    filled_quantity: str
    order_type: str
    time_in_force: str
    limit_price: str
    trailstop_price: str
