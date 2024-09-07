import os
import shutil
from typing import Dict, Union
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.indices.base import BaseIndex
from llama_index.core.base.base_query_engine import BaseQueryEngine
from llama_index.llms.openai import OpenAI
import logging
import sys
from dotenv import load_dotenv

from agents import agents

# load the .env file
load_dotenv()


# 1. Document Ingestion and Vector Index Creation
def ingest_documents(data_room_path: str) -> Union[VectorStoreIndex, BaseIndex]:
    PERSIST_DIR = "./storage"
    if not os.path.exists(PERSIST_DIR):
        documents = SimpleDirectoryReader(data_room_path).load_data()
        llm = OpenAI(temperature=0.1, model="gpt-4o")
        index = VectorStoreIndex.from_documents(documents, llm=llm)
        index.storage_context.persist(persist_dir=PERSIST_DIR)

    else:
        storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
        index = load_index_from_storage(storage_context)

    return index


# 2. Query Engine Setup
def setup_query_engine(index: Union[VectorStoreIndex, BaseIndex]) -> BaseQueryEngine:
    return index.as_query_engine(response_mode="tree_summarize", similarity_top_k=5)


# 3. Main Due Diligence Process
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

    results: Dict[str, Dict[str, str]] = {}
    for agent in diligence_agents:
        agent_results = agent.analyze()
        results[agent.__class__.__name__] = agent_results
        agent.write_to_markdown(agent_results, output_dir)

    return results


# Usage
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
