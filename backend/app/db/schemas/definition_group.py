def definition_group_schema(definition) -> dict:
    return {
        "id": str(definition["_id"]),
        "letter": definition["letter"],
        "definitions": definition["definitions"],
    }


def definition_groups_schema(definitions) -> list[dict]:
    return [definition_group_schema(definition) for definition in definitions]
