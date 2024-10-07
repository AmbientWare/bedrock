<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Projects from './(sections)/projects.svelte';
	import Editor from './(sections)/editor.svelte';
	import { pageStateStore } from './(sections)/stores.svelte';

	let pageState = pageStateStore();
	let currentState = $derived(pageState.current);
</script>

<div class="flex flex-1 flex-grow p-4">
	{#if currentState !== 'editor'}
		<div
			class="h-full flex-grow"
			in:fly={{ y: -1000, duration: 500 }}
			out:fly={{ y: -1000, duration: 500 }}
		>
			<Projects />
		</div>
	{/if}

	{#if currentState === 'editor'}
		<div
			class="max-h-[var(--main-min-height)] w-full"
			in:fly={{ y: 1000, duration: 500 }}
			out:fly={{ y: 1000, duration: 500 }}
		>
			<Editor />
		</div>
	{/if}
</div>
