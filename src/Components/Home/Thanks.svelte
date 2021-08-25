<script lang="ts">
	import { onMount } from 'svelte';

	const people = [
		{
			name: 'AngeI#9333',
			help: 'Feedback'
		},
		{
			name: 'JustMe#8491',
			help: 'Feedback'
		},
		{
			name: '悪夢#0001',
			help: 'Feedback'
		},

		{
			name: 'r/Israel Discord Server',
			help: 'Feedback'
		},
		{
			name: 'Helltaker Discord Server',
			help: 'Feedback'
		},
		{
			name: "Simon's Cult Discord Server",
			help: 'Feedback'
		},
		{
			name: 'Mlocik97#8200',
			help: 'Resolving Compilation Errors'
		},
		{
			name: 'Svelte Discord Server',
			help: 'Help With Other Problems & Such'
		}
	];

	let peopleList: HTMLElement;
	let helpList: HTMLElement;

	onMount(() => {
		// Parent has margin left/right of auto
		// Resizing help list element to make it even with the people list
		// So it could be centered correctly
		helpList.style.width = `${peopleList.clientWidth}px`;
	});
</script>

<div class="mt-5">
	<h1 class="text-4xl mb-5 text-center">Special Thanks to:</h1>
	<div class="flex gap-5 w-fit mx-auto">
		<div bind:this={peopleList}>
			{#each people as person}
				<p class="text-right">{person.name}</p>
			{/each}
		</div>
		<div class="whitespace-nowrap" bind:this={helpList}>
			{#each people as person}
				<p>{person.help}</p>
			{/each}
		</div>
	</div>
</div>
