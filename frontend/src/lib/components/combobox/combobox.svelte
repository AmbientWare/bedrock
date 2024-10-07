<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	// interfaces
	import type { SelectedValue } from './index.ts';

	let {
		frameworks = [],
		onChange
	}: { frameworks: SelectedValue[]; onChange: (selections: SelectedValue[]) => void } = $props();

	let selections: SelectedValue[] = $state([]);
	let open = $state(false);

	let checkedValues: string[] = $derived.by(() => {
		return selections.map((v) => v.id);
	});

	function addSelectedValue(value: SelectedValue) {
		selections.push(value);
	}

	function removeSelectedValue(value: SelectedValue) {
		selections = selections.filter((selectedValue) => selectedValue.id !== value.id);
	}

	function toggleSelectedValue(value: SelectedValue) {
		// check if the value is already in the selections array
		const isSelected = selections.some((v) => v.id === value.id);
		if (isSelected) {
			removeSelectedValue(value);
		} else {
			addSelectedValue(value);
		}
		onChange(selections);
	}

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between"
		>
			Use Template
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search framework..." />
			<Command.Empty>No framework found.</Command.Empty>
			<Command.Group>
				{#each frameworks as framework}
					<Command.Item
						value={framework.value}
						onSelect={() => {
							toggleSelectedValue(framework);
						}}
					>
						<Check
							class={cn(
								'mr-2 h-4 w-4',
								!checkedValues.includes(framework.id) && 'text-transparent'
							)}
						/>
						{framework.label}
					</Command.Item>
				{/each}
				<div class="mt-2 flex flex-col gap-2">
					<Button onclick={() => closeAndFocusTrigger(ids.trigger)}>
						{selections.length > 0 ? 'Apply' : 'Close'}
					</Button>
				</div>
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
