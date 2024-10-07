<script lang="ts">
	import { page } from '$app/stores';
	import * as Carousel from '$lib/components/ui/carousel';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowRight, ArrowLeft, Trash, LoaderCircle } from 'lucide-svelte/icons';
	import { Combobox, type SelectedValue } from '$lib/components/combobox';
	import type { NewProjectData, Summary, Section } from '$lib/interfaces/interfaces';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { z } from 'zod';

	// import PUBLIC_API_URL
	import { PUBLIC_API_URL } from '$env/static/public';

	const projectTemplates = $page.data.projectTemplates;

	let dialogOpen: boolean = $state(false);

	let api: CarouselAPI | undefined = $state(undefined);

	let submitting: boolean = $state(false);

	let newProject: NewProjectData = $state({
		id: crypto.randomUUID(),
		name: '',
		files: [],
		summaries: []
	});

	let templates = $derived(
		projectTemplates.map((template: any) => ({
			id: template.id,
			value: template.name,
			label: template.name
		}))
	);

	let selectedTemplates: SelectedValue[] = $state([]);
	let validationError: string | null = $state(null);

	const SectionSchema = z.object({
		name: z.string().min(1, 'Section name is required'),
		description: z.string().min(1, 'Section description is required')
	});

	const SummarySchema = z.object({
		name: z.string().min(1, 'Summary name is required'),
		sections: z.array(SectionSchema).min(1, 'At least one section is required')
	});

	const ProjectSchema = z.object({
		name: z.string().min(1, 'Project name is required'),
		files: z.array(z.string()).min(1, 'At least one file is required'),
		summaries: z.array(SummarySchema).min(1, 'At least one summary is required')
	});

	let fileObjects: File[] = $state([]);

	function handleFileSelection(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			fileObjects = Array.from(input.files);
			newProject.files = fileObjects.map((file) => file.name);
		}
	}

	async function uploadFiles(): Promise<boolean> {
		const formData = new FormData();
		// make sure we have files
		if (fileObjects.length === 0) {
			return false;
		}

		fileObjects.forEach((file) => formData.append('files', file));
		formData.append('project', newProject.name ?? '');
		try {
			const response = await fetch('/api/files/upload', {
				method: 'POST',
				body: formData
			});
			return response.ok;
		} catch (error) {
			console.error('Error uploading files:', error);
			return false;
		}
	}

	function handleTemplateSelection(newSelectedTemplates: SelectedValue[]) {
		const toAdd = newSelectedTemplates.filter(
			(template) => !newProject.summaries.some((summary) => summary.id === template.id)
		);

		const templatesToAdd = projectTemplates.filter((template: SelectedValue) =>
			toAdd.some((selectedTemplate) => selectedTemplate.id === template.id)
		);

		const summariesToAdd: Summary[] = templatesToAdd.map((template: Summary) => ({
			id: template.id,
			name: template.name,
			sections: template.sections
		}));

		const summariesToRemove = selectedTemplates.filter(
			(template) =>
				!newSelectedTemplates.some((selectedTemplate) => selectedTemplate.id === template.id)
		);

		newProject.summaries = [
			...newProject.summaries.filter(
				(summary) => !summariesToRemove.some((summaryToRemove) => summaryToRemove.id === summary.id)
			),
			...summariesToAdd
		].filter((summary) => summary.name !== null);

		selectedTemplates = newSelectedTemplates;
	}

	function clearProject() {
		newProject = {
			id: crypto.randomUUID(),
			name: null,
			files: null,
			summaries: []
		};
		validationError = null;
	}

	function addSummary() {
		newProject.summaries.push({
			id: crypto.randomUUID(),
			name: null,
			sections: [{ id: crypto.randomUUID(), name: null, description: null }]
		});
	}

	function removeSummary(summary: Summary) {
		newProject.summaries = newProject.summaries.filter((s) => s.id !== summary.id);
	}

	function addSection(summary: Summary) {
		summary.sections.push({ id: crypto.randomUUID(), name: null, description: null });
	}

	async function submitProject() {
		try {
			ProjectSchema.parse(newProject);
			validationError = null;

			// upload files
			if (!(await uploadFiles())) {
				validationError = 'No files uploaded';
				return;
			}

			submitting = true;

			// use fetch to send the project to the backend
			const response = await fetch(`${PUBLIC_API_URL}/projects/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newProject)
			});

			if (response.ok) {
				dialogOpen = false;
			} else {
				validationError = 'Failed to submit project';
			}
			submitting = false;
		} catch (error) {
			if (error instanceof z.ZodError) {
				validationError = error.errors.map((err) => err.message).join(', ');
			} else {
				validationError = 'An unexpected error occurred';
			}
		}
	}
</script>

{#snippet summarySection(section: Section, summary: Summary)}
	<div class="flex flex-col gap-2">
		<h3>SectionName:</h3>
		<Input bind:value={section.name} />
		<h3>Section Description:</h3>
		<Textarea bind:value={section.description} />
	</div>
{/snippet}

{#snippet summary(summaries: Summary[])}
	<div class="mt-4 flex items-center justify-between overflow-y-auto">
		<h3 class="font-semibold">Summaries</h3>
		<Combobox frameworks={templates} onChange={handleTemplateSelection} />
	</div>
	<Accordion.Root class="overflow-y-auto">
		{#each summaries as summary}
			<div class="mt-6 flex flex-row items-center gap-2">
				<h3>Name:</h3>
				<Input bind:value={summary.name} />
				<Button variant="outline" onclick={() => removeSummary(summary)}>
					<Trash class="h-4 w-4" />
				</Button>
			</div>
			<Accordion.Item value={summary.id}>
				<Accordion.Trigger></Accordion.Trigger>
				<Accordion.Content>
					<div class="flex flex-col gap-2">
						{#each summary.sections as section}
							{@render summarySection(section, summary)}
						{/each}
						{#if summary.sections[summary.sections.length - 1].name && summary.sections[summary.sections.length - 1].description}
							<Button onclick={() => addSection(summary)}>Add Section</Button>
						{/if}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
	<div class="mt-2 w-full">
		<Button variant="outline" class="w-full" onclick={() => addSummary()}>Add Summary</Button>
	</div>
{/snippet}

<Dialog.Root
	onOpenChange={() => {
		clearProject();
	}}
	bind:open={dialogOpen}
>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Create project</Dialog.Trigger>
	<Dialog.Content class="flex h-[90vh] max-h-[800px] w-full max-w-4xl flex-col">
		<Dialog.Header>
			<Dialog.Title>Create Project</Dialog.Title>
		</Dialog.Header>
		<Carousel.Root class="flex flex-1 flex-col overflow-hidden" bind:api>
			<div class="flex-1 overflow-y-auto">
				<Carousel.Content class="h-full">
					<Carousel.Item class="h-full">
						<div class="flex h-full flex-col gap-2 p-4">
							<h3 class="font-semibold">Project Name</h3>
							<Input bind:value={newProject.name} />
						</div>
					</Carousel.Item>
					<Carousel.Item class="h-full">
						<div class="flex h-full flex-col gap-2 p-4">
							<h3 class="font-semibold">Files</h3>
							<input
								type="file"
								id="file-uploader"
								class="hidden"
								multiple
								onchange={handleFileSelection}
							/>
							<label for="file-uploader" class="w-full cursor-pointer">
								<Button
									variant="outline"
									class="w-full"
									onclick={() => document.getElementById('file-uploader')?.click()}
								>
									Upload Files
								</Button>
							</label>
							{#if newProject.files && newProject.files.length > 0}
								<div class="mt-2">
									<h4 class="text-sm font-semibold">Selected Files:</h4>
									<ul class="list-inside list-disc">
										{#each newProject.files as file}
											<li class="text-sm text-gray-600">{file}</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</Carousel.Item>
					<Carousel.Item class="h-full">
						<div class="flex h-full flex-col gap-2 p-4">
							{@render summary(newProject.summaries)}
						</div>
					</Carousel.Item>
					<Carousel.Item class="h-full">
						<div class="flex h-full flex-col gap-4 p-4">
							<div class="flex flex-col gap-4">
								<div class="rounded-lg bg-gray-100 p-4">
									<h4 class="mb-2 text-lg font-semibold">
										Project Name: {newProject.name || 'Not specified'}
									</h4>
									<p class="text-gray-700">{newProject.name || 'Not specified'}</p>
								</div>

								<div class="rounded-lg bg-gray-100 p-4">
									<h4 class="mb-2 text-lg font-semibold">Files:</h4>
									<ul class="list-inside list-disc">
										{#each newProject.files ?? [] as file}
											<li class="text-gray-700">{file}</li>
										{/each}
										{#if newProject.files && newProject.files.length === 0}
											<p class="italic text-gray-500">No files selected</p>
										{/if}
									</ul>
								</div>

								{#each newProject.summaries as summary}
									{#if summary.name !== null}
										<div class="rounded-lg bg-gray-100 p-4">
											<h4 class="mb-2 text-lg font-semibold">Summary: {summary.name}</h4>
											{#if summary.sections.length > 0}
												<ul class="list-inside list-disc">
													{#each summary.sections as section}
														<li class="text-gray-700">{section.name || 'Unnamed section'}</li>
													{/each}
												</ul>
											{:else}
												<p class="italic text-gray-500">No sections added</p>
											{/if}
										</div>
									{/if}
								{/each}

								{#if validationError}
									<div
										class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
										role="alert"
									>
										<strong class="font-bold">Error:</strong>
										<span class="block sm:inline">{validationError}</span>
									</div>
								{/if}
							</div>

							<div class="mt-auto">
								<Button variant="outline" class="w-full" on:click={submitProject}>
									{#if submitting}
										<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									{:else}
										Submit Project
									{/if}
								</Button>
							</div>
						</div>
					</Carousel.Item>
				</Carousel.Content>
			</div>
			<div class="mt-4 flex justify-end gap-2 p-4">
				<Button variant="outline" on:click={() => api && api.scrollPrev()}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					Prev
				</Button>
				<Button variant="outline" on:click={() => api && api.scrollNext()}>
					Next
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</Carousel.Root>
	</Dialog.Content>
</Dialog.Root>
