<script lang="ts">
	import { page } from '$app/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const sessionInfo = $page.data.sessionInfo;

	let user: { name: string; email: string } = sessionInfo?.user
		? {
				name: sessionInfo.user.name,
				email: sessionInfo.user.email
			}
		: {
				name: 'John Doe',
				email: 'john.doe@example.com'
			};

	// get first letter of first and last name to use as avatar
	const initials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} class="relative h-10 w-10 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<!-- <Avatar.Image src="/icons/01.png" alt="@shadcn" /> -->
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{user.name}</p>
				<p class="text-muted-foreground text-xs leading-none">{user.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => (window.location.href = '/profile')}>
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				Subscription
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (window.location.href = '/api/logout')}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
