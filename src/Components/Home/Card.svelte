<script>
  import { fly } from 'svelte/transition';

  export let title;
  export let description;
  export let color;
  export let animationProperties;
</script>

<div
  in:fly={animationProperties}
  class="w-fit p-4 text-white rounded-md max-w-full mx-10 sm:mx-0 sm:w-auto shadow-xl"
  style="background-color: {color}"
>
  <h1 class="text-2xl"><strong>{title}</strong></h1>
  <p class="font-semibold aboutParagraph mt-1">
    {description}
  </p>
</div>
