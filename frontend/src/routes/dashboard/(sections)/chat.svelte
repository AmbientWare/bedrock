<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';

	// components
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import ChatMessage from '$lib/components/message/message.svelte';

	// interfaces
	import type { Message } from '$lib/interfaces/interfaces';

	// stores
	import { projectSelectionStore, additionalContextStore } from './stores.svelte';
	import { pageStateStore } from './stores.svelte';

	let selectionStore = projectSelectionStore();
	let pageStore = pageStateStore();
	let contextStore = additionalContextStore();

	let selection = $derived(selectionStore.current);
	let additionalContext = $derived(contextStore.text);

	// for chat
	let inputValue: string = $state('');
	let chatMessages: Message[] = $state([]);

	const url = PUBLIC_API_URL.replace(/^http/, 'ws');

	// Button styling classes
	const newDocumentButtonClass = 'bg-slate-600 hover:bg-slate-700 text-white';
	const dangerButtonClass = 'bg-rose-400 hover:bg-rose-500 text-white';
	const primaryButtonClass = 'bg-emerald-500 hover:bg-emerald-600 text-white';

	// setup websocket
	let ws = $derived(
		selection?.name && selection.selectedFile && selection.selectedFile.endsWith('.md')
			? new WebSocket(
					`${url}/agents/chat?project_name=${selection.name}&agent_name=${selection.selectedFile.split('.').slice(0, -1).join('.')}`
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

	async function formatChatMessage(messages: Message[]) {
		const latestMessage = messages[messages.length - 1];

		const requestData = {
			message: latestMessage.content,
			context: additionalContext
		};

		contextStore.set('');

		return requestData;
	}

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.shiftKey) {
			event.preventDefault();
			submitQuestion();
		} else if (event.key === 'y' && (event.metaKey || event.ctrlKey) && event.shiftKey) {
			// select text input
			const input = document.querySelector('input');
			if (input) {
				input.select();
			}
		}
	}

	async function submitQuestion() {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			contextStore.set('WebSocket is not connected');
			return;
		}

		if (inputValue.trim() === '') return;

		chatMessages.push({
			role: 'user',
			content: inputValue,
			extraContent: additionalContext ?? null
		});
		inputValue = '';

		const requestData = await formatChatMessage(chatMessages);
		ws.send(JSON.stringify(requestData));
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="relative flex h-full w-full flex-shrink-0 flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
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
					{selection.selectedFile}
				{/if}
			</small>
		</div>
		<div class="relative flex max-h-20 flex-col gap-2 overflow-auto">
			{#if additionalContext}
				<Button
					variant="ghost"
					size="sm"
					class="absolute right-0 top-0"
					onclick={() => {
						contextStore.set('');
						if (window.getSelection) {
							window.getSelection()?.removeAllRanges();
						}
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
		<Input placeholder="Chat over results..." bind:value={inputValue} onkeydown={handleKeydown} />
		<div class="flex w-full gap-2 rounded-md">
			<Button class={`flex-1 ${primaryButtonClass}`} onclick={submitQuestion}>Submit</Button>
		</div>
		<div class="flex w-full gap-2">
			<Button
				class={`flex-1 ${dangerButtonClass}`}
				onclick={() => {
					contextStore.set('');
					inputValue = '';
					chatMessages = [];
				}}
			>
				Clear
			</Button>
		</div>
	</div>
</div>
