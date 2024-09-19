<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';

	let {
		selection = $bindable(),
		additionalContext = $bindable()
	}: { selection: { project: string; filename: string } | null; additionalContext: string | null } =
		$props();

	let fileContents = $state('');
	let renderedContent = $state('');
	let editableDiv: HTMLDivElement | null = $state(null);

	$effect(() => {
		async function loadFileContents() {
			if (!selection?.project || !selection?.filename) {
				fileContents = '';
				return;
			}

			const response = await fetch(`/files/${selection.project}/${selection.filename}`);
			if (response.ok) {
				const data = await response.json();
				fileContents = data.fileContents;
				updateRenderedContent();
			} else {
				fileContents = 'Error loading file contents';
				renderedContent = fileContents;
			}
		}

		loadFileContents();
	});

	function updateRenderedContent() {
		renderedContent = DOMPurify.sanitize(marked(fileContents));
		if (editableDiv) {
			editableDiv.innerHTML = renderedContent;
		}
	}

	function handleTextSelection() {
		const textHighlight = window.getSelection();
		if (textHighlight) {
			additionalContext = textHighlight.toString().trim();
		}
	}

	function handleContentEdit() {
		fileContents = (editableDiv as HTMLDivElement).innerText;
		updateRenderedContent();
	}

	// when command shift y is pressed, add extra context to the chat
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'y' && event.metaKey && event.shiftKey) {
			event.preventDefault();
			handleTextSelection();
		}
	}

	$effect(() => {
		// @ts-ignore
		editableDiv.addEventListener('input', handleContentEdit);

		return () => {
			editableDiv?.removeEventListener('input', handleContentEdit);
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-grow flex-col rounded-lg border border-gray-300 p-4 shadow-sm">
	<h2 class="mb-4 text-2xl font-bold">Results</h2>
	<div class="flex-1 overflow-hidden">
		<div class="h-full overflow-y-auto" role="textbox" tabindex="0">
			{#if fileContents}
				<div class="w-full">
					<div class="prose w-full max-w-none" contenteditable="true" bind:this={editableDiv}>
						{@html renderedContent}
					</div>
				</div>
			{:else}
				<div class="flex h-full items-center justify-center text-gray-500">
					Select a result file to view.
				</div>
			{/if}
		</div>
	</div>
</div>
