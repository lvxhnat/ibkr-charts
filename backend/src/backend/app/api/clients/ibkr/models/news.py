from pydantic import BaseModel


class SerialisedNews(BaseModel):
    datetime: str
    provider_code: str
    article_id: str
    headline: str


class SerialisedNewsArticle(BaseModel):
    article_type: str
    article_text: str
