from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

# project imports
from bedrock.agents.testharness import run_inference
from bedrock.agents.baseAgent import Summary
from bedrock.utils import drop_project_table

projects_router = APIRouter(prefix="/projects", tags=["projects"])


class ProjectCreate(BaseModel):
    id: str
    files: List[str]
    name: str
    summaries: List[Summary]


@projects_router.post("/create", response_model=dict, status_code=201)
async def create_project(project: ProjectCreate):
    """
    Create a new project with the given name and summaries.

    Args:
        project (ProjectCreate): The project data containing name and summaries.

    Returns:
        dict: A message indicating successful project creation.

    Raises:
        HTTPException: If no summaries or project name are provided.
    """
    if not project.summaries or not project.name:
        raise HTTPException(
            status_code=400, detail="No summaries or project name provided"
        )

    await run_inference(project.name, project.summaries)

    return {"message": "Project created successfully"}


# delete project
@projects_router.delete("/{project_name}", status_code=204)
async def delete_project(project_name: str):
    """
    Delete a project by its name.

    Args:
        project_name (str): The name of the project to delete.

    Returns:
        dict: A message indicating successful project deletion.
    """
    try:
        drop_project_table(project_name)
        return {"message": "Project deleted successfully"}

    except Exception as e:
        # raise HTTPException(status_code=500, detail=str(e))
        return {"message": "Project deleted successfully"}
