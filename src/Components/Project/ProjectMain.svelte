<script lang="ts">
  // @ts-nocheck
  import { bug, isDisplayingBug, project } from '@ts/stores';
  import { CloseDialogue, DisplayDialogue } from '@ts/utils';

  import type { Bugs } from 'src/global';

  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  import BugDisplay from './BugDisplay.svelte';
  import BugTable from './BugTable.svelte';

  let bugIdToDisplay;

  let bugs: Bugs = $project?.bugs;
  $: bugs = $project?.bugs;

  const dispatch = createEventDispatcher();

  const displayBug = (e) => {
    const id = e.detail.id;
    console.log(id);
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

<div class="h-full flex justify-between">
  <div class="flex-grow mx-5 mt-5">
    {#if bugs && Object.entries(bugs).length > 0}
      {#key bugs}
        <BugTable {bugs} on:displayBug={displayBug} />
      {/key}
    {:else}
      <h2>There are no bugs! Great job!</h2>
    {/if}
    <button
      class="border border-black rounded-sm px-1 py-0.5 hover:text-white hover:bg-black transition-colors mt-5"
      on:click={() => dispatch('createBug')}
    >
      + Add Bug
    </button>
  </div>

  {#if $isDisplayingBug}
    <div
      class="bugDisplay absolute bg-opacity-90 flex-grow bg-white w-full h-full py-5 sm:bg-transparent sm:relative sm:w-fit transition-all border-l-4 border-gray-200"
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

<style>
  /*.projectMain {
		height: calc(100% - 4rem);
	}

	@media only screen and (max-width: 640px) {
		.bugDisplay {
			height: calc(100% - 4rem);
		}
	}*/
</style>
