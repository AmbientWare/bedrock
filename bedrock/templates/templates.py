from bedrock.templates.base import BaseTemplate, BaseSection
from typing import List


class InitialScreeningTemplate(BaseTemplate):
    name: str = "Initial Screening"
    sections: List[BaseSection] = [
        BaseSection(
            name="executive_summary",
            description="Provide a concise summary of the company, including: 1) The problem they're addressing, 2) Their proposed solution, 3) The target market and its size, 4) Their unique value proposition. Limit your response to 200 words.",
        ),
        BaseSection(
            name="market_potential",
            description="Evaluate the market potential and innovation level. Consider: 1) Market size and growth rate, 2) Barriers to entry, 3) Competitive landscape, 4) Unique technological advantages. Provide a score from 1-10 and justify your rating.",
        ),
        BaseSection(
            name="alignment",
            description="Assess the company's alignment with earth, energy, and environmental sectors. Explain how their product or service contributes to sustainability or addresses environmental challenges. If applicable, mention any relevant certifications or partnerships.",
        ),
    ]


class TeamAssessmentTemplate(BaseTemplate):
    name: str = "Team Assessment"
    sections: List[BaseSection] = [
        BaseSection(
            name="team_background",
            description="Summarize the backgrounds of founders and key team members. Include: 1) Relevant education, 2) Previous startup experience, 3) Industry expertise, 4) Notable achievements or recognitions.",
        ),
        BaseSection(
            name="expertise",
            description="Evaluate the team's technical expertise and industry experience. Consider: 1) Depth of knowledge in their field, 2) Years of relevant experience, 3) Any patents or publications, 4) Industry connections and reputation. Provide specific examples where possible.",
        ),
        BaseSection(
            name="completeness",
            description="Assess the team's completeness and complementary skills. Identify: 1) Any crucial roles that are missing, 2) How well the team's skills cover all aspects of the business (technical, business, marketing, etc.), 3) The team's ability to execute on their business plan. Suggest any additions that would strengthen the team.",
        ),
    ]


class TechnologyEvaluationTemplate(BaseTemplate):
    name: str = "Technology Evaluation"
    sections: List[BaseSection] = [
        BaseSection(
            name="tech_overview",
            description="Provide a clear, concise overview of the key technologies or innovations. Include: 1) The core technology and how it works, 2) Its advantages over existing solutions, 3) The current stage of development (e.g., prototype, beta, market-ready).",
        ),
        BaseSection(
            name="feasibility",
            description="Assess the technical feasibility and potential for scalability. Consider: 1) Technical challenges and how they're being addressed, 2) Resource requirements for scaling, 3) Potential regulatory hurdles. Provide a extimated Lechical Readiness Level (TLR) and explain your reasoning based on the usual TLR scale.",
        ),
        BaseSection(
            name="patents",
            description="Analyze the company's intellectual property position. List any granted patents or pending applications. For each, briefly describe: 1) The core invention, 2) Its potential impact on the business, 3) The strength of the patent protection. Also, mention any other forms of IP protection (e.g., trade secrets, copyrights) if relevant.",
        ),
    ]


class FinancialReviewTemplate(BaseTemplate):
    name: str = "Financial Review"
    sections: List[BaseSection] = [
        BaseSection(
            name="financial_summary",
            description="Summarize key financial metrics and projections. Include: 1) Current revenue and growth rate, 2) Burn rate and runway, 3) Projected financials for the next 3-5 years, 4) Key assumptions underlying these projections. Highlight any red flags or areas of concern.",
        ),
        BaseSection(
            name="revenue_model",
            description="Analyze the revenue model in detail. Describe: 1) The pricing strategy, 2) Customer acquisition costs, 3) Lifetime value of customers, 4) Potential for recurring revenue. Assess the model's viability and potential for profitability.",
        ),
        BaseSection(
            name="funding_history",
            description="Provide a comprehensive overview of the company's funding history. Include: 1) All previous funding rounds with amounts and key investors, 2) Current cap table summary (major shareholders and their stakes), 3) Valuation history, 4) Any notable terms or conditions from previous rounds that might impact future funding.",
        ),
    ]


class MarketAnalysisTemplate(BaseTemplate):
    name: str = "Market Analysis"
    sections: List[BaseSection] = [
        BaseSection(
            name="market_size",
            description="Conduct a detailed analysis of the total addressable market (TAM) and its growth potential. Include: 1) Current market size, 2) Projected CAGR for the next 5 years, 3) Key drivers of market growth, 4) Any potential threats to market expansion. Provide sources for your data where possible.",
        ),
        BaseSection(
            name="competition",
            description="Perform a thorough competitive analysis. Identify: 1) Key direct and indirect competitors, 2) Their market share and strengths, 3) The company's unique competitive advantages, 4) Potential threats from new entrants or disruptive technologies. Create a brief SWOT analysis for the company based on this competitive landscape.",
        ),
        BaseSection(
            name="market_trends",
            description="Identify and analyze key market trends and regulatory factors. Consider: 1) Technological trends shaping the industry, 2) Changes in customer behavior or preferences, 3) Relevant regulations or policies (existing and potential), 4) Economic factors that could impact the market. Explain how these trends might affect the company's growth prospects.",
        ),
    ]
