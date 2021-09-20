<script lang="ts">
  import { blur } from 'svelte/transition';

  import { Circle } from 'svelte-loading-spinners';

  import { isDisplayingDialogue } from '@ts/stores';
</script>

<div class="w-full fixed opacity-90 flex justify-center items-center h-screen top-0 z-40">
  {#if !$isDisplayingDialogue}
    <div class="fixed inset-0 bg-gray-900 bg-opacity-90" out:blur={{ duration: 425 }} />
  {/if}
  <Circle size="60" color="#FFFFFF" duration="1.5s" />
</div>
