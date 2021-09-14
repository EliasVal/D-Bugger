<script lang="ts">
  import { icon } from '@ts/Singletons';
  import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
  import { searchQuery } from '@ts/stores';
  import { CloseDialogue, DisplayDialogue, DisplayToast } from '@ts/utils';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const search = () => {
    try {
      // Split search query by semicolons that are not followed by a backslash
      let newQuery = $searchQuery.replace(/;$/, '').split(/(?<!\\);\s*/gim);
      let queryObj = {};
      for (const queryString of newQuery) {
        let queryKeyValue = queryString.split(/\s*(?<!\\):\s*/);

        if (queryKeyValue.length != 2) throw new Error('Invalid Search Query!');

        // Clear any escaped semicolons
        queryKeyValue[1] = queryKeyValue[1].replace('\\;', '');
        // Clear any escaped colons
        queryKeyValue[0] = queryKeyValue[0].replace('\\:', '');

        // Add query to object
        queryObj[queryKeyValue[0]] = queryKeyValue[1];
      }

      dispatch('search', { query: { ...queryObj } });
    } catch {
      DisplayToast({ title: 'Invalid Search Query!', duration: 5000 });
    }
  };
</script>

<form on:submit|preventDefault={search} class="flex items-center gap-4 mb-3 text-lg">
  <div class="flex items-center gap-3 flex-grow">
    <button
      type="button"
      on:click={() =>
        DisplayDialogue({
          onSubmit: CloseDialogue,
          submitBtnText: 'Close',
          header: 'Search',
          headerStyles: 'text-center text-2xl mb-5',
          fields: [
            // @ts-ignore
            {
              type: 'paragraph',
              body: '<strong>Syntax</strong>: tag: value; tag2: value2; ...<br><br><u>Available Tags</u>:<br><strong>id</strong> - BugID<br><strong>title</strong> - BugTitle<br><strong>severity</strong> - low, medium, high, severe<br><strong>status</strong> - fixed, beingFixed, onHold, abandoned<br><br><br><strong><u>Tags and values are case sensitive!</u></strong>',
            },
          ],
        })}
    >
      {@html icon(faQuestionCircle).html}
    </button>
    <input
      type="text"
      placeholder="Search Bugs..."
      class="font-mono border border-black px-1 py-0.5 rounded-sm outline-none flex-grow"
      bind:value={$searchQuery}
    />
  </div>
  <div class="flex items-center gap-3">
    <input type="submit" value="Search" class="bg-black text-white px-1.5 py-0.5 rounded-sm" />
    <input
      type="button"
      value="Clear"
      class="text-base underline bg-transparent hover:cursor-pointer"
      on:click={() => dispatch('clearSearch')}
    />
  </div>
</form>
