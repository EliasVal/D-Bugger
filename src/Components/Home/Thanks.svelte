<script lang="ts">
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
			name: 'Simon\'s Cult Discord Server',
			help: 'Feedback'
		},
		{
			name: 'Mlocik97#8200',
			help: 'Resolving Compilation Errors'
		},
		{
			name: 'kursus75#2048',
			help: 'Helped with website performance & loading times'
		},
		{
			name: 'Svelte Discord Server',
			help: 'Help With Other Problems & Such'
		}
	];
</script>

<div class="mt-5 pb-10">
	<h1 class="text-4xl mb-10 text-center">Special Thanks to:</h1>
	<div class="flex flex-col gap-5 w-fit mx-auto">
		{#each people as person}
			<div
				class="flex gap-1 sm:gap-10 text-center justify-between flex-col sm:flex-row sm:border-b sm:border-black sm:border-opacity-40"
			>
				<p class="border-b border-black sm:border-b-0">{person.name}</p>
				<div>
					<p>{person.help}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
