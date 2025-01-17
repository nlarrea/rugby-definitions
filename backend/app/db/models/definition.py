from pydantic import BaseModel


class Definition(BaseModel):
    name: str
    definition: str
    letter: str
    tags: list[str]
