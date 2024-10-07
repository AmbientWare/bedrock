from pydantic import BaseModel
from typing import List


class BaseSection(BaseModel):
    name: str
    description: str


class BaseTemplate(BaseModel):
    name: str
    sections: List[BaseSection]
