from typing import Optional, List

from llama_index.core.callbacks import trace_method
from llama_index.core.base.llms.types import ChatMessage, MessageRole
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.chat_engine.types import (
    AgentChatResponse,
)


class CustomChatEngine(CondensePlusContextChatEngine):

    @trace_method("chat")
    def chat(
        self,
        message: str,
        chat_history: Optional[List[ChatMessage]] = None,
        extra_content: Optional[str] = None,
    ) -> AgentChatResponse:
        if extra_content:
            message += f"\n\nUser Provided Sources:\n{extra_content}"

        synthesizer, context_source, context_nodes = self._run_c3(message, chat_history)

        response = synthesizer.synthesize(message, context_nodes)

        user_message = ChatMessage(content=message, role=MessageRole.USER)
        assistant_message = ChatMessage(
            content=str(response), role=MessageRole.ASSISTANT
        )
        self._memory.put(user_message)
        self._memory.put(assistant_message)

        return AgentChatResponse(
            response=str(response),
            sources=[context_source],
            source_nodes=context_nodes,
        )
