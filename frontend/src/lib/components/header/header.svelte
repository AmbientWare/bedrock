<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	// import { ModeWatcher } from 'mode-watcher';

	import User from 'lucide-svelte/icons/user';

	// components
	import LoginSignup from '$lib/components/modals/loginSignUp.svelte';
	// import DarkMode from '$lib/components/darkMode/darkMode.svelte';
	import { DashboardMainNav, UserNav } from '$lib/components/header';
	import { Icons } from '$lib/icons';

	let showLoginDialog = $state(false);

	let userLoggedIn = $page.data.sessionInfo?.user !== null;

	function toggleCreate(event: MouseEvent) {
		event.stopPropagation();
		showLoginDialog = true;
	}

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				showLoginDialog = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<!-- <ModeWatcher /> -->

<header
	class="pointer-events-auto sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between bg-white text-gray-800 shadow-md"
>
	<div class="flex items-center space-x-8">
		<div class="logo">
			<Icons.user href="/" class="mb-6 h-10 w-auto md:h-10" />
		</div>
		{#if userLoggedIn}
			<DashboardMainNav />
		{/if}
	</div>
	<nav class="flex items-center space-x-4">
		{#if !userLoggedIn}
			<Button onclick={toggleCreate} variant="outline">
				<User class="h-4 w-4" />
				<span class="ml-2 hidden sm:inline">Login / Sign Up</span>
			</Button>
		{:else}
			<UserNav />
		{/if}
		<!-- <DarkMode /> -->
	</nav>
</header>

{#if showLoginDialog}
	<div
		class="pointer-events-auto fixed left-1/2 top-1/2 z-50 min-w-[300px] -translate-x-1/2 -translate-y-1/2 transform"
		transition:fade={{ duration: 300 }}
		use:clickOutside
	>
		<LoginSignup bind:showLoginDialog />
	</div>
{/if}
