import os
from llama_index.core.base.base_query_engine import BaseQueryEngine
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class Section(BaseModel):
    name: str
    description: str


class Summary(BaseModel):
    name: str
    sections: List[Section] = []
    id: Optional[str] = None


class BaseAgent(BaseModel):
    name: str
    sections: List[Section] = []
    query_engine: BaseQueryEngine

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def query_documents(self, query: str) -> str:
        response = self.query_engine.query(query)
        return response.response

    def analyze(self) -> Dict[str, str]:
        results = {}
        for item in self.sections:
            results[item.name] = self.query_documents(item.description)

        return results

    def write_to_markdown(self, results: Dict[str, str], output_dir: str) -> None:
        os.makedirs(output_dir, exist_ok=True)
        filename = f"{self.name}.md"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w") as f:
            f.write(f"# {self.name}\n\n")
            for key, value in results.items():
                f.write(f"## {key.replace('_', ' ').title()}\n\n")
                f.write(f"{value}\n\n")
