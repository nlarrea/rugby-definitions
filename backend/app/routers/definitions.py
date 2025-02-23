from fastapi import APIRouter, status, HTTPException

from db.schemas.definition import definitions_schema
from db.client import db_client
from db.models.definition import Definition
from db.modules.definitions import (
    search_definitions_by_field,
    search_definitions_with_value,
)


router = APIRouter(prefix="/definitions", tags=["Definitions"])


@router.get("/", response_model=list[dict])
async def get_definitions(lang: str = "es"):
    """Gets all the definition groups and returns them in a list.

    Parameters
    ----------
    lang : str, optional
        The language of the definitions to search in, by default "es"
        (Spanish).

    Returns
    -------
    list[dict]
        A list that contains all the definition groups, which are all the
        definitions grouped by their first name character.
    """

    definitions = (
        db_client[lang].find().sort({"letter": 1, "name": 1}).to_list(None)
    )
    return definitions_schema(definitions)


@router.get("/letter/{letter}", response_model=list[Definition] | list[dict])
async def get_definitions_by_letter(letter: str, lang: str = "es"):
    """Gets a letter and returns the Definitions of that specific letter.

    Parameters
    ----------
    letter : str
        The letter used to group the definitions.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).

    Returns
    -------
    list[Definition] | list[dict]
        List of Definition if there are definitions grouped by the requested
        letter, otherwise an empty dictionary.

    Raises
    ------
    HTTPException
        Exception raised when there are not definitions matching the requested
        letter.
    """

    def_group = search_definitions_by_field("letter", letter, lang=lang)

    if def_group:
        return def_group

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions grouped by letter '{letter}'."
        },
    )


@router.get("/tag/{tag}", response_model=list)
async def get_definitions_by_tag(tag: str, lang: str = "es"):
    """Gets a tag name and searches for all the definitions that contain that
    specific tag.

    Parameters
    ----------
    tag : str
        The tag that has to be found.
    lang : str, optional
        The language in which the definition is going to be found, by default
        "es".

    Returns
    -------
    list[Definition]
        A list containing all the definitions that have the requested tag.

    Raises
    ------
    HTTPException
        If no definitions are found, it raises a 404 error.
    """

    definitions = search_definitions_by_field("tags", tag, lang)

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions containing '{tag}' tag."
        },
    )


@router.get("/search", response_model=list[Definition] | list)
async def search_definitions(word: str, lang: str = "es"):
    """Gets a word to find all definitions that contain that word (only in
    "definition" field).

    Parameters
    ----------
    word : str
        The word to search in the definition.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).
    """

    definitions = search_definitions_with_value(word, lang)

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions containing '{word}' word(s)."
        },
    )


@router.get("/{name}", response_model=list)
async def get_definitions_by_name(name: str, lang: str = "es"):
    """Gets the name or part of the name of a definition and returns the
    definitions that match the name (only in "name" field).

    Parameters
    ----------
    name : str
        The name or part of the name of the definition to find.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).

    Returns
    -------
    list[Definition] | list
        A list containing the definitions that match the received name. If no
        definitions are found, returns an empty list.
    """

    # definitions = search_definitions_by_field("definitions.name", name, lang)
    definitions = search_definitions_by_field("name", name, lang)

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"message": f"There are not definitions with '{name}' name."},
    )
