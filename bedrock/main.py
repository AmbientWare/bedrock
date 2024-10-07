from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bedrock.api.v1.agents import agents_router
from bedrock.api.v1.templates import templates_router
from bedrock.api.v1.projects import projects_router

# load the .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: change this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router)
app.include_router(templates_router)
app.include_router(projects_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
