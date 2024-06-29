from ib_insync import Trade


async def serialise_order(trade: Trade):
    return {
        "contract_id": trade.contract.conId,
        "symbol": trade.contract.symbol,
        "exchange": trade.contract.exchange,
        "currency": trade.contract.currency,
        "order_id": trade.order.orderId,
        "action": trade.order.action,
        "total_quantity": trade.order.totalQuantity,
        "filled_quantity": trade.order.filledQuantity,
        "order_type": trade.order.orderType,
        "time_in_force": trade.order.tif,
        "limit_price": trade.order.lmtPrice,
        "trailstop_price": trade.order.trailStopPrice,
    }
