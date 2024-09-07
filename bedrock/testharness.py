import os
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from llama_index.llms.openai import OpenAI
import logging
import sys
from dotenv import load_dotenv

# load the .env file
load_dotenv()


# 1. Document Ingestion and Vector Index Creation
def ingest_documents(data_room_path):
    # check if storage already exists
    PERSIST_DIR = "./storage"
    if not os.path.exists(PERSIST_DIR):
        # load the documents and create the index
        documents = SimpleDirectoryReader(data_room_path).load_data()
        llm = OpenAI(temperature=0.1, model="gpt-4o")
        index = VectorStoreIndex.from_documents(documents, llm=llm)
        # store it for later
        index.storage_context.persist(persist_dir=PERSIST_DIR)
    else:
        # load the existing index
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)

    return index


# 2. Query Engine Setup
def setup_query_engine(index):
    return index.as_query_engine(response_mode="tree_summarize", similarity_top_k=5)


# 3. AI Agent Base Class
class DueDiligenceAgent:
    def __init__(self, query_engine):
        self.query_engine = query_engine

    def query_documents(self, query):
        response = self.query_engine.query(query)
        return response.response

    def analyze(self):
        raise NotImplementedError("Subclasses must implement analyze method")

    def write_to_markdown(self, results, output_dir):
        os.makedirs(output_dir, exist_ok=True)
        filename = f"{self.__class__.__name__}.md"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w") as f:
            f.write(f"# {self.__class__.__name__} Analysis\n\n")
            for key, value in results.items():
                f.write(f"## {key.replace('_', ' ').title()}\n\n")
                f.write(f"{value}\n\n")


# 4. Specialized AI Agents (examples for a few steps)


class InitialScreeningAgent(DueDiligenceAgent):
    def analyze(self):
        executive_summary = self.query_documents(
            "Summarize the executive summary or pitch deck"
        )
        market_potential = self.query_documents(
            "Assess the market potential and innovation level"
        )
        alignment = self.query_documents(
            "Evaluate alignment with earth, energy, and environmental sectors"
        )

        return {
            "executive_summary": executive_summary,
            "market_potential": market_potential,
            "alignment": alignment,
        }


class TeamAssessmentAgent(DueDiligenceAgent):
    def analyze(self):
        team_background = self.query_documents(
            "Summarize the backgrounds of founders and key team members"
        )
        expertise = self.query_documents(
            "Assess the team's technical expertise and industry experience"
        )
        completeness = self.query_documents(
            "Evaluate team completeness and complementary skills"
        )

        return {
            "team_background": team_background,
            "expertise": expertise,
            "completeness": completeness,
        }


class TechnologyEvaluationAgent(DueDiligenceAgent):
    def analyze(self):
        tech_overview = self.query_documents(
            "Summarize the key technologies or innovations"
        )
        feasibility = self.query_documents(
            "Assess the technical feasibility and potential for scalability"
        )
        patents = self.query_documents(
            "List and briefly describe any patents or patent applications"
        )

        return {
            "tech_overview": tech_overview,
            "feasibility": feasibility,
            "patents": patents,
        }


class FinancialReviewAgent(DueDiligenceAgent):
    def analyze(self):
        financial_summary = self.query_documents(
            "Summarize the key financial metrics and projections"
        )
        revenue_model = self.query_documents(
            "Describe the revenue model and assess its viability"
        )
        funding_history = self.query_documents(
            "Provide an overview of previous funding rounds and current cap table"
        )

        return {
            "financial_summary": financial_summary,
            "revenue_model": revenue_model,
            "funding_history": funding_history,
        }


class MarketAnalysisAgent(DueDiligenceAgent):
    def analyze(self):
        market_size = self.query_documents(
            "Estimate the total addressable market size and growth potential"
        )
        competition = self.query_documents(
            "Analyze the competitive landscape and the company's competitive advantage"
        )
        market_trends = self.query_documents(
            "Identify key market trends and regulatory factors affecting the industry"
        )

        return {
            "market_size": market_size,
            "competition": competition,
            "market_trends": market_trends,
        }


# 5. Main Due Diligence Process
def run_due_diligence(data_room_path, output_dir):
    index = ingest_documents(data_room_path)
    query_engine = setup_query_engine(index)

    agents = [
        InitialScreeningAgent(query_engine),
        TeamAssessmentAgent(query_engine),
        TechnologyEvaluationAgent(query_engine),
        FinancialReviewAgent(query_engine),
        MarketAnalysisAgent(query_engine),
    ]

    results = {}
    for agent in agents:
        agent_results = agent.analyze()
        results[agent.__class__.__name__] = agent_results
        agent.write_to_markdown(agent_results, output_dir)

    return results


# Usage
if __name__ == "__main__":

    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
    logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

    from dotenv import load_dotenv
    import os

    load_dotenv()
    openai_api_key = os.getenv("OPENAI_API_KEY")

    data_room_path = """C:/code/bedrock/dataroom"""
    output_dir = """C:/code/bedrock/results"""

    # make sure directories exist
    for dir in [data_room_path, output_dir]:
        if not os.path.exists(dir):
            os.makedirs(dir, exist_ok=True)

    due_diligence_results = run_due_diligence(data_room_path, output_dir)
    print("Due diligence analysis complete. Results written to:", output_dir)
