from typing import List
from ib_insync import Trade
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketState

from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.orders import serialise_order
from backend.app.api.clients.ibkr.models.orders import SerialisedOrder

tag = "orders"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("")
async def portfolio_orders(websocket: WebSocket):
    await websocket.accept()
    ords: List[Trade] = await ibkr_client.reqAllOpenOrdersAsync()
    ords: List[SerialisedOrder] = [await serialise_order(ord) for ord in ords]

    await websocket.send_json({"type": "initialise", "data": ords})

    async def send_order_change(order: Trade):
        if websocket.application_state == WebSocketState.CONNECTED:
            await websocket.send_json({"type": "change", "data": await serialise_order(order)})

    ibkr_client.orderModifyEvent += send_order_change


if __name__ == "__main__":
    ibkr_client.sync_connect()
    open_orders = ibkr_client.reqAllOpenOrders()
    open_orders = [serialise_order(trade) for trade in open_orders]
    print(open_orders)
