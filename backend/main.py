from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import definitions

app = FastAPI()

ORIGINS = ("http://localhost", "https://nlarrea.github.io")

# Routers
app.include_router(definitions.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
