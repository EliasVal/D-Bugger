<script lang="ts">
  import { icon } from '@ts/Singletons';
  import { faEnvelope, faEnvelopeOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';
  import { push, update, ref, getDatabase, getAuth, remove } from '@ts/FirebaseImports';
  import { CloseDialogue, DisplayDialogue, DisplayLoading, CloseLoading } from '@ts/utils';

  export let key: string;
  export let title: string;
  export let description: string;
  export let read: boolean;
  export let hasContent: boolean;
  export let type: 'invite' | 'message';
  export let sender: string;
  export let projectId: string;

  const dispatch = createEventDispatcher();
  const db = getDatabase();
  const auth = getAuth();

  const acceptInvite = async () => {
    CloseDialogue();
    DisplayLoading();

    // Update these at the same time so it wont look weird for the owner
    let newDt = {};
    newDt[`members/${auth.currentUser.uid}`] = true;
    newDt[`pending/${auth.currentUser.uid}`] = null;
    await update(ref(db, `projects/${projectId}/details/`), newDt);

    await push(ref(db, `users/${auth.currentUser.uid}/projects`), projectId);
    await remove(ref(db, `users/${auth.currentUser.uid}/inbox/${key}`));
    CloseLoading();
  };
</script>

<div class="relative">
  <div class="absolute text-gray-300 right-2 top-0.5 flex gap-2">
    {#if type != 'invite'}
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
    {/if}
  </div>

  <div
    class="message select-none {read != true && 'message-unread'}
    {(hasContent || type == 'invite') && 'message-moreContent hover:cursor-pointer'}"
    on:click={() => {
      if (hasContent) dispatch('readMessage', { key });
      else if (type == 'invite')
        DisplayDialogue({
          header: 'Project Invitation',
          headerStyles: 'text-xl text-center',
          onSubmit: acceptInvite,
          submitBtnText: 'Accept',
          fields: [
            // @ts-ignore
            {
              type: 'paragraph',
              body: `${sender} has invited you to a project!`,
              stylingClasses: 'text-center my-5',
            },
          ],
          buttons: [
            {
              title: 'Decline',
              stylingClasses:
                'hover:bg-red-600 hover:text-white border border-red-600 transition-colors',
              onClick: async () => {
                CloseDialogue();
                DisplayLoading();
                await remove(ref(db, `users/${auth.currentUser.uid}/inbox/${key}`));
                await remove(
                  ref(db, `projects/${projectId}/details/pending/${auth.currentUser.uid}`),
                );
                CloseLoading();
              },
            },
          ],
        });
    }}
  >
    {#if type == 'invite'}
      <h2 class="text-lg"><strong>Project Invitation</strong></h2>
      <p>{sender} has invited you to a project!</p>
    {:else}
      <h2 class="text-lg"><strong>{title}</strong></h2>
      <p>{description}</p>
    {/if}
  </div>
</div>
