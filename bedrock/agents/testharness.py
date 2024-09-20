import os

from typing import Dict, Union
from llama_index.core import (
    VectorStoreIndex,
)
from llama_index.core.indices.base import BaseIndex
from llama_index.core.base.base_query_engine import BaseQueryEngine
import sys
import concurrent.futures

# project imports
from bedrock.utils import markdown_to_word, ingest_documents
from bedrock.agents import agents
from bedrock.agents.diligence import DueDiligenceAgent
from bedrock.utils import get_index_from_project
from llama_index.core.memory import ChatMemoryBuffer

DATAROOM_PATH = os.getenv("DATAROOM_PATH", "./dataroom")


def setup_chat_agent(index: Union[VectorStoreIndex, BaseIndex]):
    memory = ChatMemoryBuffer.from_defaults(token_limit=1500)

    chat_engine = index.as_chat_engine(
        chat_mode="context",
        memory=memory,
        system_prompt=(
            "You have already helped me with due diligence on a company. Now, you are helping me refine the results. I already provided you with some important context and you have provided some initial thoughts. Now, continue the conversation in a friendly, professional tone."
        ),
    )

    return chat_engine


#
def setup_query_engine(index: Union[VectorStoreIndex, BaseIndex]) -> BaseQueryEngine:
    """
    Setup the query engine for the vector index
    """
    return index.as_query_engine(response_mode="tree_summarize", similarity_top_k=5)


def run_agent(agent: DueDiligenceAgent, output_dir: str):
    """
    Run the due diligence agent and write the results to a markdown file
    """
    agent_results = agent.analyze()
    agent.write_to_markdown(agent_results, output_dir)
    return agent.__class__.__name__, agent_results


def get_agent(project_name: str, agent_name: str):
    """
    Get the due diligence agent from the data room path
    """
    index = get_index_from_project(project_name)
    query_engine = setup_chat_agent(index)

    if not query_engine:
        raise ValueError(f"Agent {agent_name} not found")

    return query_engine


def run_due_diligence(project_name: str, output_dir: str) -> Dict[str, Dict[str, str]]:
    """
    Run the due diligence agents and write the results to a markdown file
    """
    project_path = os.path.join(DATAROOM_PATH, project_name)
    index = ingest_documents(project_path)
    query_engine = setup_query_engine(index)

    diligence_agents = [
        agent(query_engine=query_engine)
        for _, agent in agents.get("diligence", {}).items()  # type: ignore
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


def run_testharness(project_name: str, to_docs: bool = False):
    output_dir: str = f"{DATAROOM_PATH}/{project_name}/results"

    # delete content of results directory if it exists
    # or create it if it doesn't exist
    if os.path.exists(output_dir):
        for file in os.listdir(output_dir):
            os.remove(os.path.join(output_dir, file))
    else:
        os.makedirs(output_dir, exist_ok=True)

    run_due_diligence(project_name, output_dir)

    # convert all files in results directory to workd documents
    if to_docs:
        for file in os.listdir(output_dir):
            if file.endswith(".md"):
                markdown_to_word(os.path.join(output_dir, file))
