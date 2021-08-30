<script lang="ts">
  import type { Bugs } from 'src/global';

  import { createEventDispatcher } from 'svelte';

  import { SplitAndCapitalise, DisplayToast } from '/src/ts/utils';

  export let bugs: Bugs;

  const dispatch = createEventDispatcher();

  const severetyColors = {
    severe: {
      bg: '#B91C1C',
      text: 'white',
    },
    high: {
      bg: '#EF4444',
      text: 'black',
    },
    medium: {
      bg: '#E59E0B',
      text: 'black',
    },
    low: {
      bg: '#60A5FA',
      text: 'black',
    },
  };

  let lastSortMethod = 'id';
  const sortBy = (val: string, elm: HTMLElement) => {
    // Check if array has already been sorted for this property, if so reverse it, if not, sort it.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

    let temp = [...Object.entries(bugs)];
    if (lastSortMethod == val) {
      temp = temp.reverse();
    } else {
      temp = temp.sort((a, b) => {
        let sorting;
        switch (val) {
          case 'id':
            // @ts-ignore
            sorting = a[1].id - b[1].id;
            break;
          case 'title':
            sorting = a[1].title < b[1].title ? -1 : a[1].title > b[1].title ? 1 : 0;
            break;
          case 'severity':
            // Converting Severity value to int using indexOf
            const s = ['severe', 'high', 'medium', 'low'];
            sorting = s.indexOf(a[1].details.severity) - s.indexOf(b[1].details.severity);
            break;
          case 'status':
            // Converting Severity value to int using indexOf
            const st = ['beingFixed', 'onHold', 'fixed', 'abandoned'];
            sorting = st.indexOf(a[1].details.severity) - st.indexOf(b[1].details.severity);
            break;
        }
        return sorting;
      });
      document.getElementById(lastSortMethod).classList.remove('sortedDown', 'sortedUp');
    }

    bugs = Object.fromEntries(temp);
    if (elm.classList.contains('sortedUp')) {
      elm.classList.remove('sortedUp');
      elm.classList.add('sortedDown');
    } else if (elm.classList.contains('sortedDown')) {
      elm.classList.remove('sortedDown');
      elm.classList.add('sortedUp');
    } else {
      elm.classList.add('sortedUp');
    }

    lastSortMethod = val;
  };
</script>

<div>
  <table class="w-full">
    <tr>
      <th
        style="width: 5ch;"
        class="sortedDown select-none"
        id="id"
        on:click={(e) => sortBy('id', e.target)}
      >
        #
      </th>
      <th class="select-none" id="title" on:click={(e) => sortBy('title', e.target)}>Title</th>
      <th class="select-none" id="severity" on:click={(e) => sortBy('severity', e.target)}>
        Severity
      </th>
      <th class="select-none" id="status" on:click={(e) => sortBy('status', e.target)}>Status</th>
    </tr>
    {#each Object.entries(bugs) as [key, bug]}
      {#if bug?.id != null}
        <tr on:click={() => dispatch('displayBug', { id: key })} class="hover:cursor-pointer">
          <td
            on:click|stopPropagation={() =>
              DisplayToast({ title: `Bug ID: ${bug.id}`, duration: 15000 })}
            class="select-none"
          >
            <button class="underline hover:cursor-pointer" title={bug.id}> (...) </button>
          </td>
          <td>{bug.title}</td>
          <td
            style="background-color: {severetyColors[bug.details.severity]
              .bg}; color: {severetyColors[bug.details.severity].text}"
          >
            {SplitAndCapitalise(bug.details.severity)}
          </td>
          <td>{SplitAndCapitalise(bug.details.status)}</td>
        </tr>
      {/if}
    {/each}
  </table>
</div>

<style>
  /* Rounded borders for the table */
  table {
    border: 1px solid #000;
    border-collapse: separate;
    border-left: 0;
    border-radius: 0.175rem;
    border-spacing: 0px;
    height: fit-content;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th,
  td {
    padding: 5px 4px 6px 4px;
    text-align: left;
    vertical-align: top;
    border-left: 1px solid #000;
  }

  td:first-of-type,
  th:first-of-type {
    text-align: center;
  }

  td {
    border-top: 1px solid #000;
  }
  th {
    cursor: pointer;
  }

  :global(.sortedUp::after) {
    content: '⯅';
  }

  :global(.sortedDown::after) {
    content: '⯆';
  }
</style>
