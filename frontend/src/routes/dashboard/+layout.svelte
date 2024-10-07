<script lang="ts">
	import { setContext } from 'svelte';

	setContext('pageState', 'projectBar');

	let { children } = $props();
</script>

{@render children()}
