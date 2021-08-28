<script lang="ts">
	import { Circle } from 'svelte-loading-spinners';
	import { isDisplayingDialogue } from '/src/ts/stores';
</script>

<div
	class="dialogue w-full h-full absolute top-0 left-0 {!$isDisplayingDialogue ??
		'bg-gray-900'} opacity-90 flex justify-center items-center"
>
	<Circle size="60" color="#FFFFFF" duration="1.5s" />
</div>
