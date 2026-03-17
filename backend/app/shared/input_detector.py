import re


def detect_input_type(query: str) -> str:
    query = query.strip()

    if "@" in query and "." in query.split("@")[-1]:
        return "email"

    if re.match(r"^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$", query):
        return "domain"

    if re.match(r"^@?[a-zA-Z0-9_]{1,30}$", query) and " " not in query:
        return "username"

    return "name"
