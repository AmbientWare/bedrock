<script lang="ts">
	import { page } from '$app/stores';
	import { projectSelectionStore } from './stores.svelte';

	// interfaces
	import type { Project } from '$lib/interfaces/interfaces';

	let selectionStore = projectSelectionStore();
	let currentProject = $derived(selectionStore.current);

	function handleFileClick(file: string) {
		selectionStore.set({
			name: currentProject?.name ?? '',
			files: currentProject?.files ?? [],
			selectedFile: file
		});
	}
</script>

<div
	class="relative flex h-full w-full flex-shrink-0 flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
>
	<h2 class="mb-4 text-2xl font-bold">{currentProject?.name}</h2>

	{#each currentProject?.files ?? [] as file}
		<button
			type="button"
			class="w-full rounded-md text-left hover:underline"
			onclick={() => handleFileClick(file)}
		>
			{file}
		</button>
	{/each}
</div>
