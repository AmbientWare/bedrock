<script lang="ts">
	import { marked } from 'marked';
	import type { Message } from '$lib/interfaces/interfaces';
	import { Check } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button';
	let { message }: { message: Message } = $props();

	let isUser = $derived(message.role === 'user');
	let showCheckmark = $state(false);

	const renderer = new marked.Renderer();
	renderer.code = ({ text, lang }) => {
		return `<pre><code class="language-${lang}">${text}</code></pre>`;
	};

	marked.setOptions({
		renderer,
		breaks: true,
		gfm: true
	});

	function copyToClipboard(content: string) {
		navigator.clipboard
			.writeText(content)
			.then(() => {
				showCheckmark = true;
				setTimeout(() => {
					showCheckmark = false;
				}, 3000);
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}

	let sanitizedContent = $derived.by(() => {
		let content = marked(message.content);
		return content;
	});
</script>

<div class="flex {isUser ? 'justify-end' : 'justify-start'} mb-2">
	<div
		class="max-w-[80%] rounded-lg px-4 py-2 {isUser
			? 'bg-gray-300 text-black'
			: 'bg-gray-100 text-black'}"
	>
		<div class="markdown-content">
			{#await sanitizedContent}
				<p>Loading...</p>
			{:then content}
				{@html content}
				{#if message.extraContent}
					<div class="flex justify-end">
						<Popover.Root portal={null}>
							<Popover.Trigger asChild let:builder>
								<Button
									variant="link"
									class="cursor-pointer p-0 text-xs text-blue-500 hover:underline"
									builders={[builder]}
								>
									View context
								</Button>
							</Popover.Trigger>
							<Popover.Content class="max-h-96 w-80 overflow-y-auto">
								{@html message.extraContent}
							</Popover.Content>
						</Popover.Root>
					</div>
				{/if}
			{:catch error}
				<p>Error: {error.message}</p>
			{/await}
		</div>
		{#if message.role !== 'user'}
			<div class="flex items-center">
				<Button
					variant="link"
					class="cursor-pointer p-0 text-xs text-blue-500 hover:underline"
					onclick={() => copyToClipboard(message.content)}
				>
					Copy to clipboard
				</Button>
				{#if showCheckmark}
					<span in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="ml-2">
						<Check size={16} class="text-green-500" />
					</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.markdown-content :global(pre) {
		background-color: #f4f4f4;
		padding: 1em;
		border-radius: 4px;
		overflow-x: auto;
	}

	.markdown-content :global(code) {
		font-family: 'Courier New', Courier, monospace;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin-left: 1.5em;
		margin-bottom: 1em;
	}
</style>
