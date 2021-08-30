<script lang="ts">
  import Card from './Card.svelte';

  const points = [
    {
      title: 'Permissions',
      description:
        "As currently only the owner of the project (the person who has created it) can edit the project's settings, we want to change that so the owner could allow certain members to do more than they could previously.",
    },
    {
      title: 'Teams & Groups',
      description:
        "Tired of adding your mates every time you open a new project? When this will be implement, you won't be! Members of teams will have access to all the projects assigned to the team!",
    },
    {
      title: 'Custom Bug Properties',
      description:
        'As some people & teams have specific needs that are outside of what this project can currently provide, we want to give them the freedom to add custom properties & extended existing ones.',
    },
    {
      title: 'API',
      description:
        'If you want to use the project outside of this website, you will eventually be able to! Using our API you will be able to handle your projects without entering the website.',
    },
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
                  style="background-color: {colors[points.indexOf(point) % 4]}"
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
                  style="background-color: {colors[points.indexOf(point) % 4]}"
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
            color={colors[points.indexOf(point) % 4]}
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
