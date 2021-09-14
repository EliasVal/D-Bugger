<script>
  import { icon } from '@ts/Singletons';
  import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

  import { createEventDispatcher, onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { slide } from 'svelte/transition';

  export let toast = {};

  const progressScale = tweened(1, {
    duration: toast.duration,
  });

  const progressTransform = tweened(0, {
    duration: toast.duration,
  });

  const dispatch = createEventDispatcher();

  onMount(() => {
    progressScale.set(0);
    progressTransform.set(-50);
  });

  progressScale.subscribe((p) => {
    if (p == 0) dispatch('removeToast', { id: toast.id });
  });

  const pause = () => {
    progressTransform.set(0, { duration: 100 });
    progressScale.set(1, { duration: 100 });
  };

  const resume = () => {
    progressTransform.set(-50);
    progressScale.set(0);
  };

  let isOpen;

  $: {
    if (isOpen) {
      pause();
      isOpen = true;
    } else {
      resume();
      isOpen = false;
    }
  }
</script>

<div class="toast relative bg-blue-300 max-w-xs sm:max-w-sm w-96 border border-black">
  <div class="flex flex-row-reverse justify-between pb-2">
    <div class="text-blue-400 mr-2 mt-1 whitespace-nowrap">
      <button
        aria-label="Close"
        title="Close"
        on:click={() => dispatch('removeToast', { id: toast.id })}
        class="mr-1"
      >
        {@html icon(faTimes).html}
      </button>
      {#if toast.desc?.length > 0}
        <button aria-label="Expand" title="Expand" on:click={() => (isOpen = !isOpen)}>
          {@html icon(isOpen ? faChevronDown : faChevronUp).html}
        </button>
      {/if}
    </div>
    <div class="ml-2 mt-2">
      <div>
        <h1 class="font-semibold text-xl">{toast.title}</h1>
      </div>
      {#if toast.description?.length > 0}
        {#if isOpen}
          <div transition:slide>
            <p>
              {@html toast.description}
            </p>
          </div>
        {/if}
      {/if}
    </div>
  </div>
  {#if !isOpen}
    <div
      class="absolute bottom-0 left-0 w-full bg-blue-900 h-1 timeLine"
      style="transform: translateX({$progressTransform}%) scaleX({$progressScale});"
    />
  {/if}
</div>

<style>
  .toast {
    box-shadow: 0 1px 5px 0 black;
  }
</style>
