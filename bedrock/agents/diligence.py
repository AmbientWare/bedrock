import os
from llama_index.core.base.base_query_engine import BaseQueryEngine
from typing import Dict, List, Type
from pydantic import BaseModel, ConfigDict


# Base class for Due Diligence Agents
class DueDiligenceAgent(BaseModel):
    query_engine: BaseQueryEngine
    task_items: Dict[str, str]

    model_config = ConfigDict(arbitrary_types_allowed=True)

    def query_documents(self, query: str) -> str:
        response = self.query_engine.query(query)
        return response.response

    def analyze(self) -> Dict[str, str]:
        results = {}
        for key, query in self.task_items.items():
            results[key] = self.query_documents(query)

        return results

    def write_to_markdown(self, results: Dict[str, str], output_dir: str) -> None:
        os.makedirs(output_dir, exist_ok=True)
        filename = f"{self.__class__.__name__}.md"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w") as f:
            f.write(f"# {self.__class__.__name__} Analysis\n\n")
            for key, value in results.items():
                f.write(f"## {key.replace('_', ' ').title()}\n\n")
                f.write(f"{value}\n\n")


# Specialized Agents
class InitialScreeningAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "executive_summary": "Summarize the executive summary or pitch deck",
        "market_potential": "Assess the market potential and innovation level",
        "alignment": "Evaluate alignment with earth, energy, and environmental sectors",
    }


class TeamAssessmentAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "team_background": "Summarize the backgrounds of founders and key team members",
        "expertise": "Assess the team's technical expertise and industry experience",
        "completeness": "Evaluate team completeness and complementary skills",
    }


class TechnologyEvaluationAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "tech_overview": "Summarize the key technologies or innovations",
        "feasibility": "Assess the technical feasibility and potential for scalability",
        "patents": "List and briefly describe any patents or patent applications",
    }


class FinancialReviewAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "financial_summary": "Summarize the key financial metrics and projections",
        "revenue_model": "Describe the revenue model and assess its viability",
        "funding_history": "Provide an overview of previous funding rounds and current cap table",
    }


class MarketAnalysisAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "market_size": "Estimate the total addressable market size and growth potential",
        "competition": "Analyze the competitive landscape and the company's competitive advantage",
        "market_trends": "Identify key market trends and regulatory factors affecting the industry",
    }


diligence_agents: List[Type[DueDiligenceAgent]] = [
    InitialScreeningAgent,
    TeamAssessmentAgent,
    TechnologyEvaluationAgent,
    FinancialReviewAgent,
    MarketAnalysisAgent,
]
