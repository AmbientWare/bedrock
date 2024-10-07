<script lang="ts">
	import Document from './document.svelte';
	import Chat from './chat.svelte';
	import ProjectBar from './projectBar.svelte';
</script>

<div class="pointer-events-auto flex h-full gap-4 overflow-auto">
	<div class="bg-secondary w-[15%] min-w-[250px] overflow-auto">
		<ProjectBar />
	</div>
	<div class="bg-secondary w-[60%] min-w-[600px] overflow-auto">
		<Document />
	</div>
	<div class="bg-secondary w-[25%] min-w-[300px] flex-shrink-0 overflow-auto">
		<Chat />
	</div>
</div>
