from fastapi import APIRouter
from backend.app.api.endpoints.portfolio import router as portfolio_router
from backend.app.api.endpoints.health import router as health_router
from backend.app.api.endpoints.contract import router as contract_router
from backend.app.api.endpoints.orders import router as orders_router
from backend.app.api.endpoints.news import router as news_router
from backend.app.api.endpoints.options import router as options_router
from backend.app.api.endpoints.search import router as search_router

api_router = APIRouter()

api_router.include_router(portfolio_router)
api_router.include_router(health_router)
api_router.include_router(orders_router)
api_router.include_router(contract_router)
api_router.include_router(news_router)
api_router.include_router(options_router)
api_router.include_router(search_router)
