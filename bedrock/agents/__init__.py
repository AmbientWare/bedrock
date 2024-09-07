from .diligence import diligence_agents

agents = {
    "diligence": diligence_agents,
}

# when import agents is used we should only return the agents
__all__ = ["agents"]
