<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';

	let { className = undefined }: { className?: string } = $props();

	let currentPath = $page.url.pathname;
	let userRole = $derived($page.data.sessionInfo?.user?.role);
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
	<a
		href="/dashboard"
		class={cn(
			'hover:text-primary text-sm font-medium transition-colors',
			currentPath !== '/dashboard' && 'text-muted-foreground'
		)}
	>
		Dashboard
	</a>
	{#if userRole === 'admin'}
		<a
			href="/"
			class={cn(
				'hover:text-primary text-sm font-medium transition-colors',
				currentPath !== '/admin' && 'text-muted-foreground'
			)}
		>
			Admin Console
		</a>
	{/if}
</nav>
