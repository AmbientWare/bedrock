import os
from typing import Dict, Union
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.vector_stores.lancedb import LanceDBVectorStore
from llama_index.core.indices.base import BaseIndex
from llama_index.core.base.base_query_engine import BaseQueryEngine
from llama_index.llms.openai import OpenAI
import logging
import sys
from dotenv import load_dotenv
import concurrent.futures
from typing import Type


# project imports
from agents import agents
from agents.diligence import DueDiligenceAgent

# load the .env file
load_dotenv()

# get the vector store uri from the .env file, if not set, use the default
VECTOR_STORE_URI = os.getenv("VS_URI", "./lancedb")


# Document Ingestion and Vector Index Creation
def ingest_documents(data_room_path: str) -> Union[VectorStoreIndex, BaseIndex]:
    documents = SimpleDirectoryReader(data_room_path).load_data()
    llm = OpenAI(temperature=0.1, model="gpt-4o")

    vector_store = LanceDBVectorStore(
        uri=VECTOR_STORE_URI,
        mode="overwrite",
        table_name="documents",
    )
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context, llm=llm
    )

    return index


# Query Engine Setup
def setup_query_engine(index: Union[VectorStoreIndex, BaseIndex]) -> BaseQueryEngine:
    return index.as_query_engine(response_mode="tree_summarize", similarity_top_k=5)


def run_agent(agent: DueDiligenceAgent, output_dir: str):
    agent_results = agent.analyze()
    agent.write_to_markdown(agent_results, output_dir)
    return agent.__class__.__name__, agent_results


# Run the due diligence agents
def run_due_diligence(
    data_room_path: str, output_dir: str
) -> Dict[str, Dict[str, str]]:
    index = ingest_documents(data_room_path)
    query_engine = setup_query_engine(index)

    diligence_agents = [
        agent(query_engine=query_engine) for agent in agents.get("diligence", {})  # type: ignore
    ]

    if not diligence_agents:
        raise ValueError("No agents found")

    results = {}
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_agent = {
            executor.submit(run_agent, agent, output_dir): agent
            for agent in diligence_agents
        }
        for future in concurrent.futures.as_completed(future_to_agent):
            agent_name, agent_results = future.result()
            results[agent_name] = agent_results

    return results


if __name__ == "__main__":
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
    logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

    load_dotenv()
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    data_room_path: str = """./dataroom"""
    output_dir: str = """C:/code/bedrock/results"""

    # make sure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    due_diligence_results: Dict[str, Dict[str, str]] = run_due_diligence(
        data_room_path, output_dir
    )
    print("Due diligence analysis complete. Results written to:", output_dir)
