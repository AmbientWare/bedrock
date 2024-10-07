<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		generateRandomColor,
		calculateGridDimensions,
		calculateNumberOfPixels,
		type GridDimensions
	} from './index';

	let { children }: { children?: Snippet } = $props();

	let pixelGridRef: HTMLDivElement;
	let gridDimensions: GridDimensions = $state({ width: 0, height: 0 });
	let hoveredPixels: Set<number> = $state(new Set());

	const pixelSize = 20;

	function handleMouseOver(id: number): void {
		hoveredPixels = new Set([...hoveredPixels, id]);
	}

	function handleMouseOut(id: number): void {
		setTimeout(() => {
			hoveredPixels = new Set([...hoveredPixels].filter((pixel) => pixel !== id));
		}, 1500);
	}

	function updateGridDimensions(): void {
		if (pixelGridRef) {
			gridDimensions = calculateGridDimensions(pixelGridRef);
		}
	}

	$effect(() => {
		updateGridDimensions();
		window.addEventListener('resize', updateGridDimensions);
		return () => window.removeEventListener('resize', updateGridDimensions);
	});

	let numberOfPixels: number = $derived.by(() =>
		calculateNumberOfPixels(gridDimensions, pixelSize)
	);
</script>

<div class="pixel-grid-container">
	<div bind:this={pixelGridRef} class="pixelGrid">
		{#each Array(numberOfPixels) as _, id}
			<div
				role="presentation"
				class={hoveredPixels.has(id) ? 'hovered' : 'pixel'}
				style="width: {pixelSize}px; height: {pixelSize}px;"
				onmouseenter={() => handleMouseOver(id)}
				onmouseleave={() => handleMouseOut(id)}
				onfocus={() => handleMouseOver(id)}
				onblur={() => handleMouseOut(id)}
			>
				{#if hoveredPixels.has(id)}
					<div class="hovered-inner" style="background-color: {generateRandomColor()};"></div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="content-above-grid z-10">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.pixel-grid-container {
		display: flex;
		flex-direction: column;
	}

	.pixelGrid {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
		width: 100%;
		overflow: hidden;
		background-color: var(--background-color);
	}

	.content-above-grid {
		background-color: var(--background-color);
		pointer-events: none;
	}

	.pixel {
		position: relative;
		transition: var(--transition-color) 0.2s ease;
		border-radius: 25%;
	}

	.pixel::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2px;
		height: 2px;
		background-color: rgb(188, 188, 188);
		border-radius: 50%;
	}

	.hovered {
		transform: scale(0.65);
		transition:
			transform 0.25s ease-in-out,
			background-color 2s ease-in-out;
		border-radius: 25%;
	}

	.hovered-inner {
		width: 100%;
		height: 100%;
		border-radius: 25%;
	}
</style>
