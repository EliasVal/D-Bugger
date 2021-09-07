<script lang="ts">
  import type { DialogueButton, DialogueField } from 'src/global';

  import { fly } from 'svelte/transition';

  import DialogueFieldComponent from './DialogueField.svelte';

  export let fields: DialogueField[] = [];
  export let buttons: DialogueButton[] = [];

  export let onSubmit: () => void;
  export let submitBtnText = 'Submit';

  export let header: string | null = null;
  export let headerStyles: string | null = null;
  export let submitBtnStyles: string | null = null;
</script>

<div
  class="dialogue w-full bg-gray-900 bg-opacity-90 flex justify-center items-center fixed h-screen top-0 z-50"
>
  <div
    class="w-2/3 md:w-5/12 bg-gray-50 rounded-md"
    in:fly={{ y: 250, delay: 400, duration: 400 }}
    out:fly={{ y: -250, duration: 500 }}
  >
    <div class="m-5">
      {#if header != null}
        <h1 class={headerStyles ?? ''}>{header}</h1>
      {/if}
      <form on:submit|preventDefault={onSubmit}>
        {#if fields}
          {#each fields as field}
            <DialogueFieldComponent {field} />
          {/each}
        {/if}
        <div class="mt-5 mx-auto block w-max">
          <input
            type="submit"
            value={submitBtnText ?? 'Submit'}
            class={submitBtnStyles ??
              'bg-black text-white p-1.5 rounded-sm hover:cursor-pointer mr-2'}
          />
          {#if buttons?.length > 0}
            {#each buttons as button}
              <input
                type="button"
                value={button.title}
                class="hover:cursor-pointer p-1.5 mr-2 rounded-sm bg-transparent {button.stylingClasses ??
                  ''}"
                on:click={() => button.onClick()}
              />
            {/each}
          {/if}
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  input:last-of-type {
    margin-right: 0;
  }
</style>
