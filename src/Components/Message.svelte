<script lang="ts">
  import { icon } from '@fortawesome/fontawesome-svg-core';
  import { faEnvelope, faEnvelopeOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';

  export let key: string;
  export let title: string;
  export let description: string;
  export let read: boolean;
  export let hasContent: boolean;

  const dispatch = createEventDispatcher();
</script>

<div class="relative">
  <div class="absolute text-gray-300 right-2 top-0.5 flex gap-2">
    <button
      title="Mark as {read ? 'unread' : 'read'}"
      on:click={() => dispatch(`markAs${read ? 'Unread' : 'Read'}`, { key })}
    >
      {@html icon(read ? faEnvelopeOpen : faEnvelope).html}
    </button>
    <button
      title="Delete message"
      class="hover:text-red-600"
      on:click={() => dispatch('deleteMessage', { key })}
    >
      {@html icon(faTimes).html}
    </button>
  </div>

  <div
    class="message select-none {!read && 'message-unread'}
    {hasContent && 'message-moreContent hover:cursor-pointer'}"
    on:click={() => {
      if (hasContent) dispatch('readMessage', { key });
    }}
  >
    <h2 class=" text-lg"><strong>{title}</strong></h2>
    <p>{description}</p>
  </div>
</div>
