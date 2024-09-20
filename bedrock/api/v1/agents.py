from fastapi import APIRouter, WebSocket, Query, Body, WebSocketDisconnect

# project imports
from bedrock.agents.testharness import (
    run_testharness as run_testharness_sync,
    get_agent,
)

agents_router = APIRouter(prefix="/agents", tags=["agents"])


@agents_router.post("/testharness")
async def run_testharness(project_name: str = Body(...), to_docs: bool = Body(False)):
    run_testharness_sync(project_name, to_docs)
    return {"message": "Test harness analysis complete. Results written to: results"}


@agents_router.websocket("/chat")
async def chat(
    websocket: WebSocket, project_name: str = Query(...), agent_name: str = Query(...)
):
    await websocket.accept()
    agent = get_agent(project_name, agent_name)
    try:
        while True:
            data = await websocket.receive_text()
            response = agent.chat(data)
            await websocket.send_text(str(response))
    except WebSocketDisconnect:
        print(
            f"WebSocket disconnected for project: {project_name}, agent: {agent_name}"
        )
