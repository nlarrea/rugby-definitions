from fastapi import APIRouter, status, HTTPException

from db.schemas.definition import definition_schema
from db.client import db_client
from db.models.definition import Definition


router = APIRouter(prefix="/definitions", tags=["Definitions"])


LIMIT = 10


def search_definitions_by_field(
    key: str,
    value: str | int,
    lang: str = "es",
    limit: int = LIMIT,
    offset: int = 0,
) -> list[Definition]:
    """Searches multiple definitions by the "key" field.

    Parameters
    ----------
    key : str
        The name of the field in which the value must be found.
    value : str | int
        The value to be found.
    lang : str, optional
        The language in which the definition should be found, by default "es".
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        A list of definitions that matches the criteria. If no definitions are
        found it returns an empty list.
    """

    if limit <= 0:
        limit = None  # It asks for all the definitions
    if offset < 0:
        offset = 0

    try:
        definitions = (
            db_client[lang]
            .find({key: {"$regex": value, "$options": "i"}})
            .sort({"letter": 1, "name": 1})
            .skip(offset)
            .to_list(limit)
        )

        return [Definition(**definition_schema(def_)) for def_ in definitions]

    except:
        return []  # Not found


@router.get("/", response_model=list[Definition])
async def get_definitions(
    lang: str = "es", limit: int = LIMIT, offset: int = 0
):
    """Gets all the definition groups and returns them in a list.

    Parameters
    ----------
    lang : str, optional
        The language of the definitions to search in, by default "es"
        (Spanish).
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        A list that contains all the definitions, which are all the definitions
        grouped by their first name character.
    """

    if limit <= 0:
        limit = None  # It asks for all the definitions
    if offset < 0:
        offset = 0

    definitions = (
        db_client[lang]
        .find()
        .sort({"letter": 1, "name": 1})
        .skip(offset)
        .to_list(limit)
    )

    return [
        Definition(**definition_schema(definition))
        for definition in definitions
    ]


@router.get("/letter/{letter}", response_model=list[Definition])
async def get_definitions_by_letter(
    letter: str, lang: str = "es", limit: int = LIMIT, offset: int = 0
):
    """Gets a letter and returns the DefinitionGroup of that specific letter.

    Parameters
    ----------
    letter : str
        The letter used to group the definitions.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        Definition list if there are definitions grouped by the requested
        letter, otherwise an empty list.

    Raises
    ------
    HTTPException
        Exception raised when there are not definitions matching the requested
        letter.
    """

    def_group = search_definitions_by_field(
        "letter", letter, lang=lang, limit=limit, offset=offset
    )

    if def_group:
        return def_group

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions grouped by letter '{letter}'."
        },
    )


@router.get("/tag/{tag}", response_model=list)
async def get_definitions_by_tag(
    tag: str, lang: str = "es", limit: int = LIMIT, offset: int = 0
):
    """Gets a tag name and searches for all the definitions that contain that
    specific tag.

    Parameters
    ----------
    tag : str
        The tag that has to be found.
    lang : str, optional
        The language in which the definition is going to be found, by default
        "es".
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        A list containing all the definitions that have the requested tag.

    Raises
    ------
    HTTPException
        If no definitions are found, it raises a 404 error.
    """

    definitions = search_definitions_by_field(
        key="tags", value=tag, lang=lang, limit=limit, offset=offset
    )

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions containing '{tag}' tag."
        },
    )


@router.get("/search", response_model=list[Definition])
async def search_definitions(
    word: str, lang: str = "es", limit: int = LIMIT, offset: int = 0
):
    """Gets a word to find all definitions that contain that word (only in
    "definition" field).

    Parameters
    ----------
    word : str
        The word to search in the definition.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        A list containing the definitions that contain the received word. If no
        definitions are found, returns an empty list.
    """

    definitions = search_definitions_by_field(
        key="definition", value=word, lang=lang, limit=limit, offset=offset
    )

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions containing '{word}' word(s)."
        },
    )


@router.get("/{name}", response_model=list[Definition])
async def get_definitions_by_name(
    name: str, lang: str = "es", limit: int = LIMIT, offset: int = 0
):
    """Gets the name or part of the name of a definition and returns the
    definitions that match the name (only in "name" field).

    Parameters
    ----------
    name : str
        The name or part of the name of the definition to find.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).
    limit : int, optional
        The maximum quantity of definitions that are going to be returned, by
        default 10.
    offset : int, optional
        The number of definitions that are going to be skipped, by default 0.

    Returns
    -------
    list[Definition]
        A list containing the definitions that match the received name. If no
        definitions are found, returns an empty list.
    """

    definitions = search_definitions_by_field(
        key="name", value=name, lang=lang, limit=limit, offset=offset
    )

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"message": f"There are not definitions with '{name}' name."},
    )
