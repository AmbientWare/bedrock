<script lang="ts">
	import { Icons } from '$lib/icons';
</script>

<div class="container flex flex-col">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center text-center">
			<Icons.user class="mb-6 h-16 w-auto md:h-20" />
			<h1 class="text-primary text-3xl font-bold md:text-5xl lg:text-6xl">Bedrock AI</h1>
			<p class="text-muted-foreground mt-4 text-lg md:text-xl">Bedrock AI is a platform...</p>
		</div>
	</div>
	<div class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
		<section class="bg-secondary rounded-2xl p-6 shadow-2xl sm:p-10">
			<div class="flex flex-grow flex-col items-center justify-center">
				<div class="container pointer-events-auto mx-auto px-4 py-12 sm:px-6 lg:px-8">
					<h2 class="mb-6 text-center text-2xl font-bold">Welcome to Bedrock AI</h2>
					<p class="mb-8 text-center">
						Discover the power of AI-driven solutions for your business. Bedrock AI provides
						cutting-edge tools and services to help you make informed decisions and stay ahead of
						the competition.
					</p>
					<div class="flex justify-center">
						<a
							href="/get-started"
							class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-semibold"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		@apply bg-background text-foreground;
	}
</style>
