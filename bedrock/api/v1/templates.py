from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

# project imports
from bedrock.templates import all_templates
from bedrock.templates.base import BaseTemplate

templates_router = APIRouter(prefix="/templates", tags=["templates"])


class TemplateModel(BaseModel):
    name: str
    description: str


class TemplateResponse(BaseModel):
    templates: List[BaseTemplate]


@templates_router.get("", response_model=TemplateResponse)
async def get_templates():
    """
    Retrieve all available templates.

    Returns:
        TemplateResponse: A list of all templates.
    """
    return TemplateResponse(templates=[template for template in all_templates])


@templates_router.get("/{template_name}", response_model=TemplateModel)
async def get_template(template_name: str):
    """
    Retrieve a specific template by its name.

    Args:
        template_name (str): The name of the template to retrieve.

    Returns:
        TemplateModel: The requested template.

    Raises:
        HTTPException: If the template is not found.
    """
    for template in all_templates:
        if template.name == template_name:
            return TemplateModel(**template.model_dump())

    raise HTTPException(status_code=404, detail="Template not found")
