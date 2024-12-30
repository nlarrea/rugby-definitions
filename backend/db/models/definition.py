from pydantic import BaseModel


class Definition(BaseModel):
    name: str
    definition: str
    tags: list[str]


class DefinitionGroup(BaseModel):
    id: str = None
    letter: str
    definitions: list[Definition]
