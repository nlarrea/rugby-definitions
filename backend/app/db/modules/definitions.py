from db.models.definition import Definition
from db.schemas.definition import definitions_schema
from db.client import db_client


def search_definitions_with_value(
    value: str, lang: str = "es"
) -> list[Definition]:
    """Searches multiple definitions where value is found in any of the
    document's fields.

    Parameters
    ----------
    value : str
        The value to search in any document field.
    lang : str, optional
        The language in which the definition should be found, by default "es".

    Returns
    -------
    list[Definition]
        A list of definitions that match the criteria. If no definitions are
        found, it returns an empty list.
    """

    value = value.lower()

    try:
        definitions = list(
            db_client[lang].aggregate(
                [
                    {
                        "$search": {
                            "index": f"search-{lang}-v2",
                            "text": {
                                "query": value,
                                "path": ["name", "definition", "tags"],
                                "fuzzy": {"maxEdits": 2},
                            },
                        }
                    },
                    {"$sort": {"letter": 1, "name": 1}},
                ]
            )
        )

        found_defs = definitions_schema(definitions)
        return [Definition(**def_) for def_ in found_defs]

    except:
        return []


def search_definitions_by_field(
    key: str, value, lang: str = "es"
) -> list[Definition]:
    """Searches multiple definitions by the "key" field.

    Parameters
    ----------
    key : str
        The name of teh field in which the value must be found.
    value : str | int
        The value to be found.
    lang : str, optional
        The language in which the definition should be found, by default "es".

    Returns
    -------
    list[Definition]
        A list of definitions that match the criteria. If no definitions are
        found, it returns an empty list.
    """

    try:
        definitions = list(
            db_client[lang].aggregate(
                [
                    # Filter "key" field by regex
                    {
                        "$match": {
                            key: {
                                "$regex": value,
                                "$options": "i",  # no case-sensitivity
                            }
                        }
                    },
                    # Select the fields to show (1) / not to show (0)
                    {"$project": {"_id": 0}},
                    # Sort the returning data by fields
                    # (1 = ascending, -1 = descending)
                    {"$sort": {"letter": 1, "name": 1}},
                ]
            )
        )

        found_defs = definitions_schema(definitions)
        return [Definition(**def_) for def_ in found_defs]

    except:
        return []
