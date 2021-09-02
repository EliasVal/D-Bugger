<script lang="ts">
  import { Circle } from 'svelte-loading-spinners';
  import { isDisplayingDialogue } from '@ts/stores';
</script>

<div
  class="w-full h-full absolute
	{$isDisplayingDialogue ? '' : 'bg-gray-900'}
	opacity-90 flex justify-center items-center sticky h-screen bottom-0 z-40"
>
  <Circle size="60" color="#FFFFFF" duration="1.5s" />
</div>
