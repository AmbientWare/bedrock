<script lang="ts">
	import type { Message } from '$lib/interfaces/interfaces';

	export let message: Message;

	$: isUser = message.role === 'user';
</script>

<div class="flex {isUser ? 'justify-end' : 'justify-start'} mb-4">
	<div
		class="max-w-[70%] rounded-2xl px-4 py-2 {isUser
			? 'bg-blue-500 text-white'
			: 'bg-gray-200 text-black'}"
	>
		<p>{@html message.content}</p>
	</div>
</div>
