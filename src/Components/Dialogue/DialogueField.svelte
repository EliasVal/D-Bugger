<script lang="ts">
	import type { DialogueField } from 'src/global';

	export let field: DialogueField;
</script>

<div>
	<label for={field.id}>{field.name}:</label><br />
	{#if field.type == 'choice'}
		<select
			id={field.id}
			class="border rounded-sm border-black pl-1 py-0.5 font-mono hover:cursor-pointer outline-none w-full mt-1 mb-2"
		>
			{#each field.options as option}
				<option value={option.value}>{option.text}</option>
			{/each}
		</select>
	{:else}
		<input
			class="border border-black rounded-sm pl-1 outline-none font-mono w-full mt-1 mb-2"
			id={field.id}
			type={field.type}
			placeholder={field.placeholder}
			minlength={field.minlength ?? 0}
			maxlength={field.maxlength ?? 524288}
		/>
	{/if}
</div>
