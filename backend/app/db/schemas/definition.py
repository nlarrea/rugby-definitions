def definition_schema(definition) -> dict:
    if type(definition) == list:
        return {
            "name": definition[0]["name"],
            "definition": definition[0]["definition"],
            "letter": definition[0]["letter"],
            "tags": definition[0]["tags"],
        }

    else:
        return {
            "name": definition["name"],
            "definition": definition["definition"],
            "letter": definition["letter"],
            "tags": definition["tags"],
        }


def definitions_schema(definitions) -> list[dict]:
    return [definition_schema(definition) for definition in definitions]
