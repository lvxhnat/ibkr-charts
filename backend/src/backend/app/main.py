import asyncio
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.app.api import api_router
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config.base_config import ibkr_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """startup and shutdown events"""
    asyncio.create_task(ibkr_client.connect())
    yield
    ibkr_client.disconnect()
    print("Shutting down IBKR servers.")


def create_app() -> FastAPI:

    app: FastAPI = FastAPI(
        title="backend",
        description="",
        version="1.0.0.",
        contact={"name": "Yi Kuang", "email": "yikuang5@gmail.com"},
        lifespan=lifespan,
    )

    origins = [
        "http://localhost:*",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://frontend:3000",
        "http://frontend:*",
    ]

    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app: FastAPI = create_app()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1237, reload=True)
