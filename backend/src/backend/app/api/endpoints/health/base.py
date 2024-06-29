import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.config.base_config import ibkr_client

tag = "health"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("")
async def health(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json({"connected_status": ibkr_client.isConnected()})
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        print("Health Socket Disconnected")
    except RuntimeError:
        print(f"RuntimeError Encountered on Health Socket.")
