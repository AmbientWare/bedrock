<script lang="ts">
	import { page } from '$app/stores';
	// components
	import Create from '$lib/components/modals/createProject.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Trash } from 'lucide-svelte';

	// interfaces
	import type { Project } from '$lib/interfaces/interfaces';

	// stores
	import { pageStateStore, projectSelectionStore } from './stores.svelte';

	let selectionStore = projectSelectionStore();
	let currentProject = $derived(selectionStore.current);

	let pageStore = pageStateStore();

	let allProjects: Project[] = $state($page.data.projectList);

	let intervalId: NodeJS.Timeout | null = null;

	$effect(() => {
		intervalId = setInterval(async () => {
			const response = await fetch('/projects');
			if (response.ok) {
				const newData = await response.json();
				allProjects = newData;
			}
		}, 1000);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	async function deleteProject(event: Event, name: string) {
		event.stopPropagation();
		console.log('Deleting project:', name);
		const response = await fetch(`/api/projects/${name}`, { method: 'DELETE' });
		if (response.ok) {
			allProjects = allProjects.filter((project) => project.name !== name);
		}
		if (currentProject?.name === name) {
			selectionStore.set(null);
		}
	}

	// handle project click
	async function handleProjectClick(project: Project) {
		selectionStore.set({ name: project.name, files: project.files, selectedFile: '' });
		pageStore.set('editor');
	}
</script>

<div
	class="bg-secondary container pointer-events-auto flex h-full flex-grow flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
>
	<div class="mb-4 flex items-start justify-between">
		<h2 class="text-2xl font-bold">Projects</h2>
		<Create />
	</div>
	<div class="h-full flex-grow overflow-y-auto">
		{#if allProjects && allProjects.length > 0}
			<div class="flex flex-wrap gap-4">
				{#each allProjects as project}
					<Card.Root
						class="relative w-[350px] hover:cursor-pointer hover:border-gray-400 hover:bg-gray-200"
						onclick={() => handleProjectClick(project)}
					>
						<Card.Header>
							<Card.Title>{project.name}</Card.Title>
							<Card.Description>This is a test description for the project</Card.Description>
						</Card.Header>
						<Card.Content>
							{#each project.files as file}
								<div>{file}</div>
							{/each}
						</Card.Content>
						<Card.Footer class="flex justify-between"></Card.Footer>
						<Trash
							class="absolute right-2 top-2 h-4 w-4 hover:text-red-500"
							onclick={(event) => deleteProject(event, project.name)}
						/>
					</Card.Root>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center">
				<div class="text-center text-gray-500">No Projects Found</div>
			</div>
		{/if}
	</div>
</div>
