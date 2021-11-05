<script lang="ts">
  // @ts-nocheck
  import { bug, isDisplayingBug, project } from '@ts/stores';
  import { CloseDialogue, DisplayDialogue } from '@ts/utils';

  import type { Bugs } from 'src/global';

  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  import BugDisplay from './BugDisplay.svelte';
  import BugTable from './BugTable.svelte';
  import Search from './Search.svelte';

  export let bugsLength = 0;
  export let showingSearchResults = false;

  let bugIdToDisplay;

  let bugs: Bugs = $project?.bugs;
  $: bugs = $project?.bugs;

  const dispatch = createEventDispatcher();

  const displayBug = (e) => {
    const id = e.detail.id;
    // Check if data about the bug was modified and not saved.
    if (
      $bug &&
      bugIdToDisplay in $project.bugs &&
      JSON.stringify($bug) != JSON.stringify($project.bugs[bugIdToDisplay])
    ) {
      DisplayDialogue({
        header: 'You have unsaved changes!',
        headerStyles: 'text-lg text-center',
        onSubmit: () => {
          dispatch('saveBugChanges', {
            bug: $bug,
          });
          CloseDialogue();
          $isDisplayingBug = false;
        },
        submitBtnText: 'Save Changes',
        buttons: [
          {
            title: 'Cancel',
            onClick: () => CloseDialogue,
          },
          {
            title: 'Reset Changes',
            // And as mentioned before, same here
            onClick: () => {
              bug.set(JSON.parse(JSON.stringify($project.bugs[bugIdToDisplay])));
              CloseDialogue();
            },
            stylingClasses:
              'hover:bg-red-600 hover:text-white border border-red-600 transition-colors',
          },
        ],
      });
    }
    // Check if no bug is displayed
    else if (!$isDisplayingBug) {
      bugIdToDisplay = id;

      /*
       * If you are wondering what in the hell is this mess, when I update a property
       * of the writable in BugDisplay.svelte it also modifies project.bugs[id], so
       * I had to bypass this behaviour by completely detaching the bug from the array and passing it
       */
      bug.set(JSON.parse(JSON.stringify($project.bugs[id])));

      $isDisplayingBug = true;
    }
    // Check if the bug that is intended to display is already displayed, if so, close the display
    else if ($isDisplayingBug && bugIdToDisplay == id) $isDisplayingBug = false;
    // If changing display between bugs
    else {
      $isDisplayingBug = false;
      // This waits for the transition to complete
      setTimeout(() => {
        bugIdToDisplay = id;
        // Same goes here
        bug.set(JSON.parse(JSON.stringify($project.bugs[id])));
        $isDisplayingBug = true;
      }, 400);
    }
  };

  const saveBugChanges = () => {
    if ($bug && JSON.stringify($bug) != JSON.stringify($project.bugs[bugIdToDisplay])) {
      dispatch('saveBugChanges', { bug: $bug });
    }
  };
</script>

<div class="h-full flex justify-between pt-10 sm:pt-0">
  <div class="flex-grow mx-5 mt-5">
    {#if bugsLength > 0}
      <Search on:search on:clearSearch />
    {/if}
    {#if bugs && Object.entries(bugs).length > 0}
      {#key bugs}
        <BugTable {bugs} on:displayBug={displayBug} />
      {/key}
    {:else}
      <h2>
        {showingSearchResults
          ? 'No Bugs found. Maybe try a different query?'
          : 'There are no bugs! Great job!'}
      </h2>
    {/if}
    <div class="py-5 flex justify-between items-center">
      <button
        class="border border-black rounded-sm px-1 py-0.5 hover:text-white hover:bg-black transition-colors"
        on:click={() => dispatch('createBug')}
      >
        + Add Bug
      </button>
      {#if bugsLength && bugsLength > 0 && !showingSearchResults}
        <div class="flex items-center gap-2">
          <h3>Page:</h3>
          <select
            class="border border-black px-1 py-0.5 rounded-sm outline-none hover:cursor-pointer"
            on:change={(e) => dispatch('changePage', { index: e.target.value })}
          >
            {#each new Array(Math.ceil(bugsLength / 25)) as page, i}
              <option value={i}>
                {i + 1}
              </option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
  </div>

  {#if $isDisplayingBug}
    <div
      class="bugDisplay fixed top-0 bg-opacity-95 flex-grow w-full h-full sm:w-fit sm:h-auto bg-white py-5 sm:bg-transparent sm:relative sm:top-auto transition-all border-l-4 border-gray-200"
      transition:fly|local={{ x: 200, duration: 500 }}
    >
      <BugDisplay
        on:deleteBug
        on:saveBugChanges={saveBugChanges}
        on:closeBug={() => ($isDisplayingBug = false)}
      />
    </div>
  {/if}
</div>
