import re
from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketState
from ib_insync import HistoricalNews, NewsArticle

from backend.app.config.base_config import ibkr_client
from backend.app.api.clients.ibkr.models.news import (
    SerialisedNews,
)

tag = "news"
router = APIRouter(tags=[tag], prefix=f"/{tag}")


@router.websocket("/{contractId}")
async def get_news_stream(contractId: str, websocket: WebSocket):
    await websocket.accept()
    start: datetime = datetime.today() - timedelta(days=10)
    end: datetime = datetime.today()
    news_providers = await ibkr_client.reqNewsProvidersAsync()
    provider_codes = "+".join([provider.code for provider in news_providers])
    headlines: List[HistoricalNews] = await ibkr_client.reqHistoricalNewsAsync(
        contractId, provider_codes, start, end, 30
    )
    serialise_headlines = lambda headline: {
        "datetime": headline.time.strftime("%d %b %Y %H:%M"),
        "provider_code": headline.providerCode,
        "article_id": headline.articleId,
        "headline": re.sub(r"\{.*?\}", "", headline.headline.replace("!", "")),
    }
    hist_news: List[SerialisedNews] = [*map(serialise_headlines, headlines)] if headlines else []

    await websocket.send_json(hist_news)

    async def send_data(ticker):
        if websocket.application_state == WebSocketState.CONNECTED:
            await websocket.send_json({})


@router.get("/article/{providerCode}/{articleId}")
async def get_news_article(providerCode: str, articleId: str):
    article: NewsArticle = await ibkr_client.reqNewsArticleAsync(
        providerCode=providerCode, articleId=articleId
    )
    return {
        "article_type": article.articleType,
        "article_text": article.articleText,
    }


if __name__ == "__main__":
    from ib_insync import IB

    client = IB()
    client.connect()
    bulletins = client.reqNewsBulletins(False)
    newsticks = client.newsTicks()
    newsbulletins = client.newsBulletins()
    print(bulletins, newsbulletins)
    print(newsticks)
