<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { monitorFlash } from '$lib/components/notification';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Header } from '$lib/components/header';
	import PixelGrid from '$lib/components/pixelgrid/pixelgrid.svelte';

	// stores
	import { projectSelectionStore } from './dashboard/(sections)/stores.svelte';
	import { pageStateStore } from './dashboard/(sections)/stores.svelte';
	import { additionalContextStore } from './dashboard/(sections)/stores.svelte';

	$effect(() => {
		monitorFlash($page);
	});

	// initialize stores
	projectSelectionStore();
	pageStateStore();
	additionalContextStore();

	let { children } = $props();
</script>

<PixelGrid>
	<div class="flex min-h-screen flex-col">
		<Header />
		<main class="flex flex-1">
			{@render children()}
		</main>
		<footer
			class="border-border bg-background/70 text-foreground pointer-events-auto flex h-[var(--footer-height)] items-center border-t transition-colors duration-300"
		>
			<div class="container mx-auto">
				<ul class="flex items-center justify-center gap-8">
					<li><a href="/terms-and-conditions" class="hover:underline">Terms and Conditions</a></li>
					<li><a href="/privacy-policy" class="hover:underline">Privacy Policy</a></li>
					<li><a href="/" class="hover:underline">Contact Us</a></li>
				</ul>
			</div>
		</footer>

		<Toaster richColors closeButton />
	</div>
</PixelGrid>

<style>
	:global(:root) {
		--header-bg: hsl(var(--secondary));
		--header-text: hsl(var(--primary));
		--header-height: 70px;
		--footer-height: 70px;
		--footer-bg: hsl(var(--secondary));
		--footer-text: hsl(var(--primary));
		--main-min-height: calc(100vh - var(--header-height) - var(--footer-height));
	}
</style>
