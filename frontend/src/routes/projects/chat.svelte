<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';

	// components
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import ChatMessage from '$lib/components/message/message.svelte';

	// interfaces
	import type { Message } from '$lib/interfaces/interfaces';

	let {
		additionalContext = $bindable(),
		selection = $bindable()
	}: {
		additionalContext: string | null;
		selection: { project: string; filename: string } | null;
	} = $props();

	// for chat
	let inputValue: string = $state('');
	let chatMessages: Message[] = $state([]);
	let selectedText: string = $state('');

	const url = PUBLIC_API_URL.replace(/^http/, 'ws');

	// setup websocket
	let ws = $derived(
		selection?.project && selection.filename && selection.filename.endsWith('.md')
			? new WebSocket(
					`${url}/agents/chat?project_name=${selection.project}&agent_name=${selection.filename.split('.').slice(0, -1).join('.')}`
				)
			: null
	);

	$effect(() => {
		if (ws) {
			ws.onopen = () => {
				console.log('WebSocket connected');
			};

			ws.onmessage = (event) => {
				chatMessages.push({ role: 'assistant', content: event.data });
			};

			ws.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			ws.onclose = () => {
				console.log('WebSocket disconnected');
			};
		}
	});

	$effect(() => {
		return () => {
			if (ws) ws.close();
		};
	});

	function formatChatMessage(messages: Message[]) {
		const latestMessage = messages[messages.length - 1];
		let chatMessage = 'Message: ' + latestMessage.content;

		if (additionalContext) {
			chatMessage += '\nContent related to the message: ' + additionalContext;
		}

		additionalContext = '';

		return chatMessage;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault();
			submitQuestion();
		}
	}

	async function submitQuestion() {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			console.error('WebSocket is not connected');
			return;
		}

		if (inputValue.trim() === '') return;

		chatMessages.push({ role: 'user', content: inputValue });
		inputValue = '';

		const requestData = formatChatMessage(chatMessages);
		ws.send(JSON.stringify(requestData));
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="flex h-full w-1/4 flex-shrink-0 flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
>
	<h2 class="mb-4 text-2xl font-bold">Discussion</h2>
	<div class="w-full flex-1 overflow-y-auto">
		{#each chatMessages as message}
			<ChatMessage {message} />
		{/each}
	</div>
	<div class="mt-4 flex w-full flex-col gap-2">
		<div class="flex flex-col gap-2">
			<small class="text-gray-500">
				{#if selection}
					{selection.filename}
				{/if}
			</small>
		</div>
		<div class="relative flex max-h-20 flex-col gap-2 overflow-auto">
			{#if additionalContext}
				<Button
					variant="ghost"
					size="sm"
					class="absolute right-0 top-0"
					on:click={() => {
						additionalContext = '';
						if (window.getSelection) {
							window.getSelection()?.removeAllRanges();
						}
						selectedText = '';
					}}
				>
					Clear
				</Button>
				<small class="pr-16 text-gray-500">
					Current context: {additionalContext}
				</small>
			{:else}
				<small class="text-gray-500"> No additional context highlighted </small>
			{/if}
		</div>
		<Input placeholder="Chat over results..." bind:value={inputValue} on:keydown={handleKeydown} />
		<div class="flex w-full gap-2">
			<Button class="flex-1" on:click={submitQuestion}>Submit</Button>
			<Button
				class="flex-1"
				on:click={() => {
					additionalContext = '';
					inputValue = '';
					chatMessages = [];
				}}
			>
				Clear
			</Button>
		</div>
	</div>
</div>
