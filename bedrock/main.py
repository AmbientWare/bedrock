from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bedrock.api.v1.agents import agents_router

# load the .env file
load_dotenv()

app = FastAPI()

app.include_router(agents_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
