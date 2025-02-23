import os
from dotenv import load_dotenv
from pymongo import MongoClient, server_api

load_dotenv()

DB_URI = os.getenv("DB_URI")

db_client = MongoClient(DB_URI, server_api=server_api.ServerApi("1"))[
    "definitions-v2"
]
