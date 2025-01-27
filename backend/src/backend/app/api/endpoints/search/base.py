from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.api.clients.ibkr.search import search_mongodb

tag = "search"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


class QueryParams(BaseModel):
    fixed_query: str


@router.post("/{search_term}")
def search_term(search_term: str, params: QueryParams):
    return search_mongodb(search_term, params.fixed_query)
