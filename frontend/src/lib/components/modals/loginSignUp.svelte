<script lang="ts">
	import { Icons } from '$lib/icons/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import X from 'lucide-svelte/icons/x';
	import { PUBLIC_SCHEDULE_LINK } from '$env/static/public';

	let { showLoginDialog = $bindable(false) } = $props();
</script>

<Card.Root>
	<Button
		onclick={() => (showLoginDialog = false)}
		variant="outline"
		size="icon"
		class="absolute right-2 top-2 z-10"
	>
		<X />
	</Button>
	<Card.Header class="space-y-1">
		<Card.Title class="text-2xl">Login</Card.Title>
	</Card.Header>
	<Card.Content class="grid gap-4">
		<form method="POST" action="/api/auth/token">
			<div class="grid grid-cols-1 gap-2">
				<Input type="access-token" name="access-token" placeholder="Access Token" />
				<Button class="w-full" type="submit">Login</Button>
			</div>
		</form>
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t"></span>
			</div>
		</div>
		<form method="POST" action="/api/auth/google">
			<div class="grid grid-cols-1 gap-6">
				<Button variant="outline" type="submit">
					<Icons.google class="mr-2 h-4 w-4" />
					Continue with Google
				</Button>
			</div>
		</form>
		<div class="flex justify-end">
			<a href={PUBLIC_SCHEDULE_LINK} class="text-blue-300 hover:text-blue-500 hover:underline"
				>request access
			</a>
		</div>
	</Card.Content>
</Card.Root>
