<script lang="ts">
	import Card from './Card.svelte';

	const points = [
		{
			title: 'Lorem Ipsum',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean laoreet nunc id vestibulum egestas. Etiam ut massa vitae felis convallis gravida. Integer accumsan risus dolor, in elementum ligula luctus eget. Vivamus in efficitur nunc. Proin non auctor augue. Aliquam nec odio id nisi venenatis pellentesque. Ut sit amet eleifend velit, ac tincidunt est.'
		},
		{
			title: 'Lorem Ipsum',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean laoreet nunc id vestibulum egestas. Etiam ut massa vitae felis convallis gravida. Integer accumsan risus dolor, in elementum ligula luctus eget. Vivamus in efficitur nunc. Proin non auctor augue. Aliquam nec odio id nisi venenatis pellentesque. Ut sit amet eleifend velit, ac tincidunt est.'
		}
	];

	const colors = ['#EF4444', '#10B981', '#8B5CF6', '#DB2777'];

	let width;
</script>

<svelte:window bind:innerWidth={width} />

<div id="roadmap">
	<h1 class="text-4xl text-center my-5">Roadmap</h1>
	<div class="pt-5 pb-10">
		{#if width >= 1024}
			<!-- Dude is a king -->
			<!-- https://tailwindcomponents.com/component/simple-vertical-timeline -->
			<div class="container mx-auto w-full h-full">
				<div class="relative wrap overflow-hidden p-10 h-full">
					<div
						class="border-2-2 absolute border-opacity-20 border-gray-700 h-full border"
						style="left: 50%"
					/>
					{#each points as point}
						{#if points.indexOf(point) % 2 != 0}
							<div class="mb-8 flex justify-between items-center w-full right-timeline">
								<div class="order-1 w-5/12" />
								<div class="point">
									<h1 class="mx-auto font-semibold text-lg text-white">
										{points.indexOf(point) + 1}
									</h1>
								</div>
								<div
									style="background-color: {colors[Math.floor(Math.random() * colors.length)]}"
									class="order-1 rounded-lg shadow-xl w-5/12 px-6 py-4"
								>
									<h2 class="mb-3 font-bold text-white text-xl">{point.title}</h2>
									<p class="text-sm leading-snug tracking-wide text-white text-opacity-100">
										{point.description}
									</p>
								</div>
							</div>
						{:else}
							<div
								class="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline"
							>
								<div class="order-1 w-5/12" />
								<div class="point">
									<h1 class="mx-auto text-white font-semibold text-lg">
										{points.indexOf(point) + 1}
									</h1>
								</div>
								<div
									style="background-color: {colors[Math.floor(Math.random() * colors.length)]}"
									class="order-1 rounded-lg shadow-xl w-5/12 px-6 py-4"
								>
									<h2 class="mb-3 font-bold text-white text-xl">{point.title}</h2>
									<p
										class="text-sm font-medium leading-snug tracking-wide text-white text-opacity-100"
									>
										{point.description}
									</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-5 mx-0 sm:mx-10">
				{#each points as point}
					<Card
						color={colors[Math.floor(Math.random() * colors.length)]}
						title={point.title}
						description={point.description}
						animationProperties={{}}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	#roadmap {
		scroll-margin-top: 4rem;
	}

	.point {
		z-index: 3;
		@apply flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full;
	}
</style>
