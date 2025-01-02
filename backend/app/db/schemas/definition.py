def definition_schema(definition) -> dict:
    if type(definition) == list:
        return {
            "name": definition["definitions"][0]["name"],
            "definition": definition["definitions"][0]["definition"],
            "tags": definition["definitions"][0]["tags"],
        }

    else:
        return {
            "name": definition["definitions"]["name"],
            "definition": definition["definitions"]["definition"],
            "tags": definition["definitions"]["tags"],
        }


def definitions_schema(definitions) -> list[dict]:
    return [definition_schema(definition) for definition in definitions]
