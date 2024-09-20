import os
from llama_index.core.base.base_query_engine import BaseQueryEngine
from typing import Dict, List, Type
from pydantic import BaseModel, ConfigDict


class DueDiligenceAgent(BaseModel):
    query_engine: BaseQueryEngine
    task_items: Dict[str, str] = {}

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


class InitialScreeningAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "executive_summary": "Provide a concise summary of the company, including: 1) The problem they're addressing, 2) Their proposed solution, 3) The target market and its size, 4) Their unique value proposition. Limit your response to 200 words.",
        "market_potential": "Evaluate the market potential and innovation level. Consider: 1) Market size and growth rate, 2) Barriers to entry, 3) Competitive landscape, 4) Unique technological advantages. Provide a score from 1-10 and justify your rating.",
        "alignment": "Assess the company's alignment with earth, energy, and environmental sectors. Explain how their product or service contributes to sustainability or addresses environmental challenges. If applicable, mention any relevant certifications or partnerships.",
    }


class TeamAssessmentAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "team_background": "Summarize the backgrounds of founders and key team members. Include: 1) Relevant education, 2) Previous startup experience, 3) Industry expertise, 4) Notable achievements or recognitions.",
        "expertise": "Evaluate the team's technical expertise and industry experience. Consider: 1) Depth of knowledge in their field, 2) Years of relevant experience, 3) Any patents or publications, 4) Industry connections and reputation. Provide specific examples where possible.",
        "completeness": "Assess the team's completeness and complementary skills. Identify: 1) Any crucial roles that are missing, 2) How well the team's skills cover all aspects of the business (technical, business, marketing, etc.), 3) The team's ability to execute on their business plan. Suggest any additions that would strengthen the team.",
    }


class TechnologyEvaluationAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "tech_overview": "Provide a clear, concise overview of the key technologies or innovations. Include: 1) The core technology and how it works, 2) Its advantages over existing solutions, 3) The current stage of development (e.g., prototype, beta, market-ready).",
        "feasibility": "Assess the technical feasibility and potential for scalability. Consider: 1) Technical challenges and how they're being addressed, 2) Resource requirements for scaling, 3) Potential regulatory hurdles. Provide a extimated Lechical Readiness Level (TLR) and explain your reasoning based on the usual TLR scale.",
        "patents": "Analyze the company's intellectual property position. List any granted patents or pending applications. For each, briefly describe: 1) The core invention, 2) Its potential impact on the business, 3) The strength of the patent protection. Also, mention any other forms of IP protection (e.g., trade secrets, copyrights) if relevant.",
    }


class FinancialReviewAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "financial_summary": "Summarize key financial metrics and projections. Include: 1) Current revenue and growth rate, 2) Burn rate and runway, 3) Projected financials for the next 3-5 years, 4) Key assumptions underlying these projections. Highlight any red flags or areas of concern.",
        "revenue_model": "Analyze the revenue model in detail. Describe: 1) The pricing strategy, 2) Customer acquisition costs, 3) Lifetime value of customers, 4) Potential for recurring revenue. Assess the model's viability and potential for profitability.",
        "funding_history": "Provide a comprehensive overview of the company's funding history. Include: 1) All previous funding rounds with amounts and key investors, 2) Current cap table summary (major shareholders and their stakes), 3) Valuation history, 4) Any notable terms or conditions from previous rounds that might impact future funding.",
    }


class MarketAnalysisAgent(DueDiligenceAgent):
    task_items: Dict[str, str] = {
        "market_size": "Conduct a detailed analysis of the total addressable market (TAM) and its growth potential. Include: 1) Current market size, 2) Projected CAGR for the next 5 years, 3) Key drivers of market growth, 4) Any potential threats to market expansion. Provide sources for your data where possible.",
        "competition": "Perform a thorough competitive analysis. Identify: 1) Key direct and indirect competitors, 2) Their market share and strengths, 3) The company's unique competitive advantages, 4) Potential threats from new entrants or disruptive technologies. Create a brief SWOT analysis for the company based on this competitive landscape.",
        "market_trends": "Identify and analyze key market trends and regulatory factors. Consider: 1) Technological trends shaping the industry, 2) Changes in customer behavior or preferences, 3) Relevant regulations or policies (existing and potential), 4) Economic factors that could impact the market. Explain how these trends might affect the company's growth prospects.",
    }


diligence_agents: Dict[str, Type[DueDiligenceAgent]] = {
    "InitialScreeningAgent": InitialScreeningAgent,
    "TeamAssessmentAgent": TeamAssessmentAgent,
    "TechnologyEvaluationAgent": TechnologyEvaluationAgent,
    "FinancialReviewAgent": FinancialReviewAgent,
    "MarketAnalysisAgent": MarketAnalysisAgent,
}
