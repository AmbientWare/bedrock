<script>
	import '../app.css';
	import Header from '$lib/components/header/header.svelte';

	let { children } = $props();
</script>

<div class="screen flex h-screen overflow-hidden bg-gray-100 p-2">
	<div class="flex h-full w-full flex-col rounded-lg bg-white p-6 shadow-lg">
		<Header />
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
