<script lang="ts">
	import ProjectBar from './projectBar.svelte';
	import Document from './document.svelte';
	import Chat from './chat.svelte';

	let { selection, additionalContext, showChat } = $state({
		selection: null as { project: string; filename: string } | null,
		additionalContext: null as string | null,
		showChat: false
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'l' && event.metaKey && event.shiftKey) {
			event.preventDefault();
			showChat = !showChat;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-full w-full gap-4 rounded-lg bg-white p-6 shadow-lg">
	<ProjectBar bind:selection />
	<Document bind:selection bind:additionalContext />

	{#if showChat}
		<Chat bind:selection bind:additionalContext />
	{/if}
</div>
