from fastapi import APIRouter, status, HTTPException

from db.schemas.definition import definition_schema, definitions_schema
from db.schemas.definition_group import (
    definition_group_schema,
    definition_groups_schema,
)
from db.client import db_client
from db.models.definition import DefinitionGroup, Definition


router = APIRouter(tags=["Definitions"])


def search_definition_group_by_field(
    key: str, value, lang: str = "es"
) -> DefinitionGroup | dict:
    """Gets a key and a value and tries to find one definition group whose key
    "key" has the value "value".

    Parameters
    ----------
    key : str
        The name of the field that is going to be used to filter definition
        groups.
    value : Any
        The value to find in the specified key-field.
    lang : str, optional
        The language of the definitions to find, by default "es" (Spanish).

    Returns
    -------
    DefinitionGroup | dict
        The DefinitionGroup that matches the condition. Otherwise, an empty
        dictionary.
    """

    try:
        def_group = db_client[lang].find_one({key: value})
        return DefinitionGroup(**definition_group_schema(def_group))

    except:
        return {}  # Not found


def search_definition_by_field(
    key: str, value, lang: str = "es"
) -> Definition | dict:
    """Search a single definition by the received "key" field.

    Parameters
    ----------
    key : str
        The name of the field in which the search is going to be made.
    value : Any
        The value that has to be found in the "key" field.
    lang : str, optional
        The language in which the search is going to be made, by default "es".

    Returns
    -------
    Definition | dict
        A single definition if any is found, otherwise an empty dictionary.
    """

    try:
        definition = db_client[lang].find_one(
            {
                "$or": [
                    {key: value.lower()},
                    {key: value.upper()},
                    {key: value.capitalize()},
                ]
            },
            {"definitions.$": 1, "_id": 0},
        )
        return Definition(**definition_schema(definition))

    except:
        return {}  # Not found


def search_definitions_by_field(
    key: str, value, lang: str = "es"
) -> list[Definition]:
    """Searches multiple definitions by the "key" field.

    Parameters
    ----------
    key : str
        The name of the field in which the value must be found.
    value : Any
        The value to be found.
    lang : str, optional
        The language in which the definition should be found, by default "es".

    Returns
    -------
    list[Definition]
        A list of definitions that matches the criteria. If no definitions are
        found it returns an empty list.
    """

    try:
        definitions = list(
            db_client[lang].aggregate(
                [
                    # Decompose "definitions" array in individual elements
                    {"$unwind": "$definitions"},
                    # Filter "key" field (inside "definitions") by regex
                    {
                        "$match": {
                            key: {
                                "$regex": value,
                                "$options": "i",  # no case-sensitivity
                            }
                        }
                    },
                    # Select only "definitions.name" and
                    # "definitions.definition" fields and exclude "_id"
                    {
                        "$project": {
                            "_id": 0,
                            "definitions.name": 1,
                            "definitions.definition": 1,
                            "definitions.tags": 1,
                        }
                    },
                ]
            )
        )

        found_defs = definitions_schema(definitions)
        return [Definition(**def_) for def_ in found_defs]

    except:
        return []  # Not found


@router.get("/definitions", response_model=list[dict])
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

    definitions = db_client[lang].find().sort({"letter": 1}).to_list(None)
    return definition_groups_schema(definitions)


@router.get(
    "/definitions/letter/{letter}", response_model=DefinitionGroup | dict
)
async def get_definitions_by_letter(letter: str, lang: str = "es"):
    """Gets a letter and returns the DefinitionGroup of that specific letter.

    Parameters
    ----------
    letter : str
        The letter used to group the definitions.
    lang : str, optional
        The language in which the definitions are going to be returned, by
        default "es" (Spanish).

    Returns
    -------
    DefinitionGroup | dict
        DefinitionGroup if there are definitions grouped by the requested
        letter, otherwise an empty dictionary.

    Raises
    ------
    HTTPException
        Exception raised when there are not definitions matching the requested
        letter.
    """

    def_group = search_definition_group_by_field("letter", letter, lang=lang)

    if def_group:
        return def_group

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions grouped by letter '{letter}'."
        },
    )


@router.get("/definitions/search", response_model=list[Definition] | list)
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

    definitions = search_definitions_by_field(
        "definitions.definition", word, lang
    )

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "message": f"There are not definitions containing '{word}' word(s)."
        },
    )


@router.get("/definitions/{name}", response_model=list)
async def get_definition_by_name(name: str, lang: str = "es"):
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

    definitions = search_definitions_by_field("definitions.name", name, lang)

    if definitions:
        return definitions

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"message": f"There are not definitions with '{name}' name."},
    )
