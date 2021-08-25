<script>
	import IntersectionObserver from 'svelte-intersection-observer';

	import Card from './Card.svelte';

	const cards = [
		{
			title: 'Open Source',
			description:
				"We're an Open-Source Project with the entire code being available on our github page.",
			color: '#EF4444',
			animDelay: 100
		},
		{
			title: 'Privacy & Transparency',
			description:
				'We value your privacy. No data is currently being stored about the user, and if in the future there will be, we will notify everyone on the what and how.',
			color: '#10B981',
			animDelay: 200
		},
		{
			title: 'Cheap Prices',
			description:
				'We try to keep our prices as low as possible, and allow as much as possible for free. We do this in order to let the end user focus on more important stuff, like the project and not on stuff like budget managment.',
			color: '#8B5CF6',
			animDelay: 300
		},
		{
			title: 'Made with Svelte & Love',
			description:
				'As mentioned previously, this project was made using Svelte & SvelteKit, with love and passion.',
			color: '#DB2777',
			animDelay: 350
		}
	];

	let element, intersecting, alreadyAnimated;

	$: {
		if (intersecting && !alreadyAnimated) alreadyAnimated = true;
	}
</script>

<div id="about">
	<div class="text-center my-5">
		<h1 class="text-4xl">About us</h1>
	</div>

	<div class="w-2/3 lg:w-1/3 mx-auto text-justify">
		<p>
			This project was made by a single developer as his first project with Svelte & SvelteKit. It
			was made to help developers keep track of bugs and details about said bugs, without having to
			pay too much, or at all.
		</p>
	</div>
	<IntersectionObserver {element} bind:intersecting>
		<div bind:this={element} class="flex flex-col mt-24 pb-24 mx-auto gap-10 aboutUs">
			{#if intersecting || alreadyAnimated}
				{#each cards as card}
					<Card
						title={card.title}
						description={card.description}
						color={card.color}
						animationProperties={{ y: 50, duration: 1500, delay: card.animDelay }}
					/>
				{/each}
			{/if}
		</div>
	</IntersectionObserver>
</div>

<style>
	:global(.aboutParagraph) {
		max-width: 60ch;
		min-width: 30ch;
	}

	.aboutUs {
		align-items: center;
		max-width: 1024px;
		min-height: 500px;
	}

	@media only screen and (min-width: 1150px) {
		.aboutUs {
			align-items: flex-start;
		}
		:global(.aboutUs > div:nth-child(even)) {
			align-self: flex-end;
		}
	}

	#about {
		scroll-margin-top: 4rem;
	}
</style>
