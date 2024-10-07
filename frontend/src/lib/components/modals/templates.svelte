<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';

	let {
		show = $bindable(),
		onClose = $bindable(),
		projectData = $bindable()
	}: {
		show: boolean;
		onClose: () => void;
		projectData:
			| {
					name: string;
					summaries: { name: string; sections: { name: string; description: string }[] }[];
			  }
			| undefined;
	} = $props();

	let fetchedTemplates: { name: string; sections: { name: string; description: string }[] }[] =
		$state([]);

	let segmentedTemplates: { name: string; sections: { name: string; description: string }[] }[] =
		$derived.by(() => {
			return fetchedTemplates
				.map((template) => {
					const existingSections =
						projectData?.summaries.flatMap((s) => s.sections.map((sec) => sec.name)) || [];
					return {
						name: template.name,
						sections: template.sections.filter(
							(section) => !existingSections.includes(section.name)
						)
					};
				})
				.filter((template) => template.sections.length > 0);
		});

	$effect(() => {
		fetch(`${PUBLIC_API_URL}/templates`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				fetchedTemplates = Array.isArray(data) ? data : data.sections || [];
			})
			.catch((error) => {
				console.error('Error fetching templates:', error);
				fetchedTemplates = [];
			});
	});

	function close() {
		show = false;
		onClose();
	}

	function selectTemplate(template: any) {
		projectData?.summaries.push(template);
	}
</script>

{#if show}
	<div
		class="relative flex h-full w-full flex-shrink-0 flex-col rounded-lg border border-gray-300 p-4 shadow-sm"
	>
		<h2 class="mb-4 text-xl font-bold">Select a Template</h2>
		<div class="flex flex-col gap-2">
			{#each segmentedTemplates as template}
				<div class="flex items-center justify-between rounded border p-2">
					<span>{template.name}</span>
					<Button onclick={() => selectTemplate(template)}>Add</Button>
				</div>
			{/each}
		</div>
		<div class="mt-4 flex justify-end gap-2 py-2">
			<Button onclick={close}>Close</Button>
		</div>
	</div>
{/if}
