from fastapi import APIRouter, WebSocket, Query, WebSocketDisconnect

# project imports
from bedrock.agents.testharness import (
    get_agent,
)

agents_router = APIRouter(prefix="/agents", tags=["agents"])


@agents_router.websocket("/chat")
async def chat(
    websocket: WebSocket, project_name: str = Query(...), agent_name: str = Query(...)
):
    """
    Websocket endpoint for chat. This is not shown by Swagger UI.
    """
    await websocket.accept()
    agent = get_agent(project_name, agent_name)
    try:
        while True:
            data = await websocket.receive_json()
            message = data.get("message")
            context = data.get("context")
            response = agent.chat(message, extra_content=context)
            await websocket.send_text(str(response))
    except WebSocketDisconnect:
        print(
            f"WebSocket disconnected for project: {project_name}, agent: {agent_name}"
        )
