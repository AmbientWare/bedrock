<script lang="ts">
	import { browser } from '$app/environment';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { Document, Packer, Paragraph, TextRun } from 'docx';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';

	// stores
	import { projectSelectionStore, additionalContextStore, pageStateStore } from './stores.svelte';

	let selectionStore = projectSelectionStore();
	let contextStore = additionalContextStore();
	let pageState = pageStateStore();

	let replacementText = $derived(contextStore.replacementText);
	let selection = $derived(selectionStore.current);

	let editorContainer: HTMLDivElement;
	let editorScrollContainer: HTMLDivElement;

	function preserveScrollPosition(callback: () => void) {
		if (editorScrollContainer) {
			const scrollTop = editorScrollContainer.scrollTop;
			callback();
			setTimeout(() => {
				editorScrollContainer.scrollTop = scrollTop;
			}, 0);
		} else {
			callback();
		}
	}

	function replaceHighlightedText(newText: string) {
		if (editor) {
			preserveScrollPosition(() => {
				if (editor) {
					const { from, to } = editor.state.selection;
					editor.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
					contextStore.replace(null);
				}
			});
		}
	}

	function handleContentEdit() {
		if (editor) {
			console.log('editor content updated');
		}
	}

	function handleTextSelection() {
		if (editor) {
			const { from, to } = editor.state.selection;
			const text = editor.state.doc.textBetween(from, to);
			if (text) {
				contextStore.set(text.trim());
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'y' && (event.metaKey || event.ctrlKey) && event.shiftKey) {
			event.preventDefault();
			handleTextSelection();
		}
	}

	async function exportToDocx() {
		if (editor) {
			const text = editor.getText();
			const doc = new Document({
				sections: [
					{
						properties: {},
						children: [
							new Paragraph({
								children: [new TextRun(text)]
							})
						]
					}
				]
			});

			const blob = await Packer.toBlob(doc);
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'document.docx';
			link.click();
			URL.revokeObjectURL(link.href);
		}
	}

	function handleMenuItemClick(action: string) {
		if (editor) {
			preserveScrollPosition(() => {
				editor?.chain().focus();
				switch (action) {
					case 'bold':
						editor?.chain().toggleBold().run();
						break;
					case 'italic':
						editor?.chain().toggleItalic().run();
						break;
					case 'underline':
						editor?.chain().toggleUnderline().run();
						break;
					case 'strike':
						editor?.chain().toggleStrike().run();
						break;
					case 'h1':
						editor?.chain().toggleHeading({ level: 1 }).run();
						break;
					case 'h2':
						editor?.chain().toggleHeading({ level: 2 }).run();
						break;
					case 'bulletList':
						editor?.chain().toggleBulletList().run();
						break;
					case 'orderedList':
						editor?.chain().toggleOrderedList().run();
						break;
					case 'alignLeft':
						editor?.chain().setTextAlign('left').run();
						break;
					case 'alignCenter':
						editor?.chain().setTextAlign('center').run();
						break;
					case 'alignRight':
						editor?.chain().setTextAlign('right').run();
						break;
					case 'codeBlock':
						editor?.chain().toggleCodeBlock().run();
						break;
				}
			});
		}
	}

	async function handleExit() {
		selectionStore.set(null);
		pageState.set('projects');
	}

	$effect(() => {
		if (replacementText) {
			replaceHighlightedText(replacementText);
		}
	});

	let fileContents = $derived.by(async () => {
		async function loadFileContents() {
			if (!selection?.name || !selection?.selectedFile) {
				return '';
			}

			const response = await fetch(`/api/files/${selection.name}/${selection.selectedFile}`);
			if (response.ok) {
				const data = await response.json();
				const htmlContent = await marked(data.fileContents);
				return DOMPurify.sanitize(htmlContent);
			} else {
				return 'Error loading file contents';
			}
		}

		return await loadFileContents();
	});

	let editor: Editor | undefined = $derived.by(() => {
		if (!browser) {
			return undefined;
		}

		let e = new Editor({
			element: editorContainer,
			extensions: [
				StarterKit,
				Underline,
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				Link,
				Image
			],
			content: '',
			onUpdate: handleContentEdit
		});

		return e;
	});

	$effect(() => {
		if (editor && fileContents) {
			fileContents.then((contents) => {
				preserveScrollPosition(() => {
					editor?.commands.setContent(contents);
				});
			});
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-full flex-grow flex-col rounded-lg border border-gray-300 shadow-sm">
	<div class="mb-4 flex items-center justify-between p-4">
		<h2 class="text-2xl font-bold">Document Editor</h2>
		<div class="flex items-center gap-2">
			<Button variant="outline" onclick={handleExit}>Exit</Button>
			<Button variant="outline">Save</Button>
			<Button onclick={exportToDocx} variant="outline">Export to DOCX</Button>
		</div>
	</div>
	<div class="flex flex-1 flex-col overflow-hidden">
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Format</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item onclick={() => handleMenuItemClick('bold')}>
						Bold
						<Menubar.Shortcut>⌘B</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('italic')}>
						Italic
						<Menubar.Shortcut>⌘I</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('underline')}>
						Underline
						<Menubar.Shortcut>⌘U</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('strike')}>Strike</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Headings</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item onclick={() => handleMenuItemClick('h1')}>Heading 1</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('h2')}>Heading 2</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Lists</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item onclick={() => handleMenuItemClick('bulletList')}>Bullet List</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('orderedList')}
						>Ordered List</Menubar.Item
					>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Align</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item onclick={() => handleMenuItemClick('alignLeft')}>Left</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('alignCenter')}>Center</Menubar.Item>
					<Menubar.Item onclick={() => handleMenuItemClick('alignRight')}>Right</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger>Code</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item onclick={() => handleMenuItemClick('codeBlock')}>Code Block</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>

		<div class="flex-1 overflow-y-auto" bind:this={editorScrollContainer}>
			<div class="h-full w-full" bind:this={editorContainer}></div>
		</div>
	</div>
</div>

<style>
	:global(.ProseMirror) {
		padding: 1rem;
		min-height: 100%;
		outline: none;
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #333;
	}

	:global(.ProseMirror h1) {
		font-size: 2.5em;
		margin-bottom: 0.7em;
		font-weight: bold;
		color: #2c3e50;
	}

	:global(.ProseMirror h2) {
		font-size: 2em;
		margin-bottom: 0.6em;
		font-weight: bold;
		color: #34495e;
	}

	:global(.ProseMirror h3) {
		font-size: 1.5em;
		margin-bottom: 0.5em;
		font-weight: bold;
		color: #455a64;
	}

	:global(.ProseMirror p) {
		margin-bottom: 1.2em;
	}

	:global(.ProseMirror ul, .ProseMirror ol) {
		margin-bottom: 1.2em;
		padding-left: 2.5em;
	}

	:global(.ProseMirror ul) {
		list-style-type: disc;
	}

	:global(.ProseMirror ol) {
		list-style-type: decimal;
	}

	:global(.ProseMirror li) {
		margin-bottom: 0.5em;
		display: list-item;
	}

	:global(.ProseMirror li > p) {
		margin-bottom: 0.3em;
	}

	:global(.ProseMirror blockquote) {
		border-left: 4px solid #3498db;
		margin-bottom: 1.2em;
		padding: 0.5em 1em;
		color: #555;
		font-style: italic;
		background-color: #f8f9fa;
	}

	:global(.ProseMirror pre) {
		background-color: #f6f8fa;
		border: 1px solid #e1e4e8;
		border-radius: 6px;
		padding: 1em;
		overflow-x: auto;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.9em;
		line-height: 1.45;
	}

	:global(.ProseMirror code) {
		background-color: #f6f8fa;
		border-radius: 3px;
		padding: 0.2em 0.4em;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.9em;
	}

	:global(.ProseMirror a) {
		color: #3498db;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	:global(.ProseMirror a:hover) {
		color: #2980b9;
		text-decoration: underline;
	}

	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	:global(.ProseMirror hr) {
		border: none;
		border-top: 2px solid #ecf0f1;
		margin: 2em 0;
	}

	:global(.ProseMirror strong) {
		font-weight: 600;
	}

	:global(.ProseMirror em) {
		font-style: italic;
	}

	:global(.ProseMirror u) {
		text-decoration: underline;
	}

	:global(.ProseMirror s) {
		text-decoration: line-through;
	}
</style>
