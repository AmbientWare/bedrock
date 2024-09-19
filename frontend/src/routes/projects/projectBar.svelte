<script lang="ts">
	import { page } from '$app/stores';

	// components
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	// interfaces
	import type { Project } from '$lib/interfaces/interfaces';

	let { selection = $bindable() }: { selection: { project: string; filename: string } | null } =
		$props();

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

	async function deleteProject(name: string) {
		const response = await fetch(`/projects/${name}`, { method: 'DELETE' });
		if (response.ok) {
			allProjects = allProjects.filter((project) => project.name !== name);
		}
		if (selection?.project === name) {
			selection = null;
		}
	}
</script>

<div
	class="flex h-full w-1/6 flex-shrink-0 flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
>
	<h2 class="mb-4 text-2xl font-bold">Projects</h2>
	<div class="flex-1 overflow-hidden">
		<div class="h-full overflow-y-auto">
			{#if allProjects && allProjects.length > 0}
				<div class="flex flex-col gap-4">
					{#each allProjects as project, index}
						<Accordion.Root>
							<Accordion.Item value={`item-${index}`}>
								<div class="flex items-center">
									<Accordion.Trigger class="flex-grow">{project.name}</Accordion.Trigger>
									<Button class="ml-auto" onclick={() => deleteProject(project.name)}>Delete</Button
									>
								</div>
								<Accordion.Content>
									{#each project.files as file, _}
										<div>
											<button
												class="w-full p-1 text-left hover:bg-gray-100"
												onclick={() => {
													selection = { project: project.name, filename: file };
												}}
											>
												{file}
											</button>
										</div>
									{/each}
									<div class="space-y-2">
										{#each Array(Math.max(0, 5 - project.files.length)) as _}
											<Skeleton class="h-4 w-full" />
										{/each}
									</div>
								</Accordion.Content>
							</Accordion.Item>
						</Accordion.Root>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center">
					<div class="text-center text-gray-500">No Projects Found</div>
				</div>
			{/if}
		</div>
	</div>
</div>
