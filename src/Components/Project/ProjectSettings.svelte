<script>
  import { get, getAuth, getDatabase, ref, remove, set, update } from '@ts/FirebaseImports';
  import { isDisplayingProjectSettings, project } from '@ts/stores';
  import {
    CloseDialogue,
    CloseLoading,
    DisplayDialogue,
    DisplayLoading,
    DisplayToast,
  } from '@ts/utils';

  import { createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade, fly, slide } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let addMemberID;

  const removeMember = async (member) => {
    DisplayLoading();
    await remove(ref(getDatabase(), `projects/${$project.id}/details/members/${member}`));
    CloseLoading();
  };

  const sendInvite = async () => {
    DisplayLoading();
    if (addMemberID in ($project.details?.members ?? {}) || $project.details.owner == addMemberID) {
      DisplayToast({ title: 'This user is already part of the project!', duration: 3000 });
      addMemberID = '';
      CloseLoading();
      return;
    } else if (addMemberID in ($project.details?.pending ?? {})) {
      DisplayToast({ title: 'This user has already received an invite!', duration: 3000 });
      addMemberID = '';
      CloseLoading();
      return;
    } else if (addMemberID == undefined || !addMemberID.replace(/\s/g, '').length) {
      DisplayToast({ title: 'This field cannot be empty!', duration: 3000 });
      addMemberID = '';
      CloseLoading();
      return;
    }

    const tempUser = await (
      await get(ref(getDatabase(), `users/${addMemberID}/displayName`))
    ).val();

    if (!tempUser) {
      DisplayToast({ title: 'This user does not exist!', duration: 3000 });
      addMemberID = '';
      CloseLoading();
      return;
    }

    await set(
      ref(getDatabase(), `projects/${$project.id}/details/pending/${addMemberID}`),
      tempUser,
    );

    addMemberID = '';
    CloseLoading();
  };

  const cancelInvite = async (member) => {
    DisplayLoading();
    await remove(ref(getDatabase(), `users/${member}/inbox/${$project.details.pending[member]}`));
    await remove(ref(getDatabase(), `projects/${$project.id}/details/pending/${member}`));
    CloseLoading();
  };

  const deleteProject = (e) => {
    if (e.target[0].value === 'CONFIRM') dispatch('deleteProject');
    else DisplayToast({ title: "Please type 'CONFIRM' to confirm deletion.", duration: 3000 });
  };

  let tempProjName = $project.details.name;
</script>

{#if $project?.details}
  <div class="h-full flex flex-col items-center">
    <h2 class="text-3xl my-10">Project Settings</h2>
    <div class="w-1/2 h-fit">
      <form
        on:submit|preventDefault={async () => {
          DisplayLoading();
          await update(ref(getDatabase(), `projects/${$project.id}/details/`), {
            name: tempProjName,
          });
          CloseLoading();
        }}
      >
        <label for="projectName">Project Name:</label>
        <div>
          <input
            class="projNameInput border border-black rounded-sm pl-1 outline-none font-mono w-full mt-1 mb-2"
            id="projectName"
            type="test"
            placeholder="Enter name..."
            minlength="3"
            maxlength="30"
            bind:value={tempProjName}
          />
          {#if tempProjName != $project.details.name}
            <div
              class="inline-block sm:float-right w-fit mx-auto sm:mx-0"
              transition:fade|local={{ duration: 100 }}
            >
              <input
                class="text-black text-sm border border-black px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-black hover:text-white transition-colors"
                type="submit"
                value="Save"
              />
              <input
                class="text-black text-sm border border-red-600 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
                type="button"
                value="Discard Changes"
                on:click={() => {
                  tempProjName = $project.details.name;
                }}
              />
            </div>
          {/if}
        </div>
      </form>

      <div class="my-5">
        <label for="members">Members:</label><br />
        <div class="flex flex-col">
          <ul>
            {#if $project.details.members}
              {#each Object.keys($project.details?.members) as member, i (i)}
                <li
                  class="bg-black text-white px-2 py-1 rounded-md {i > 0 && 'mt-1'}"
                  transition:fly={{ duration: 1000, x: 50 }}
                  animate:flip
                >
                  <p class="text-left inline">
                    {#await get(ref(getDatabase(), `users/${member}/displayName`)) then snapshot}
                      {#await snapshot.val() then name}
                        {name}
                      {/await}
                    {/await}
                  </p>
                  <button
                    type="button"
                    on:click={() => removeMember(member)}
                    class="float-right font-mono text-gray-400 hover:text-red-500"
                  >
                    x
                  </button>
                </li>
              {/each}
            {:else}
              <li class="bg-black text-white px-2 py-1 rounded-md my-1" transition:slide|local>
                <p class="text-left inline">No Members</p>
              </li>
            {/if}
          </ul>
        </div>
      </div>
      <div>
        <label for="pending">Pending Invites:</label><br />
        <div class="flex flex-col">
          <ul class="mb-1.5">
            {#each Object.entries($project.details?.pending || {}) as [id, lastknownName], i (i)}
              <li
                class="bg-black text-white px-2 py-1 rounded-md {i > 0 && 'mt-1'}"
                transition:fly={{ duration: 1000, x: 50 }}
                animate:flip
              >
                <p class="text-left inline whitespace-nowrap">
                  {#await get(ref(getDatabase(), `users/${id}/displayName`))}
                    {lastknownName} | Name may be outdated, loading updated name.
                  {:then snapshot}
                    {#await snapshot.val() then name}
                      {name}
                    {/await}
                  {/await}
                </p>
                <button
                  type="button"
                  on:click={() => cancelInvite(id)}
                  class="float-right font-mono text-gray-400 hover:text-red-500"
                >
                  x
                </button>
              </li>
            {/each}
          </ul>
        </div>
        <form on:submit|preventDefault={sendInvite}>
          <input
            class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none w-full"
            type="text"
            placeholder="Enter user ID..."
            id="assignedTo"
            bind:value={addMemberID}
          />
          <input
            type="submit"
            value="Invite"
            class="border-2 border-black px-2 py-0.5 rounded-sm bg-transparent hover:bg-black hover:text-white transition-colors hover:cursor-pointer w-full mt-1"
          />
        </form>
      </div>
      <div class="flex btns justify-center gap-3 mt-16">
        <button
          class="text-black text-sm border border-black px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-black hover:text-white transition-colors"
          type="button"
          on:click={() => {
            isDisplayingProjectSettings.set(false);
          }}
        >
          Close
        </button>
        {#if $project.details?.owner == getAuth().currentUser.uid}
          <button
            type="button"
            class="text-black text-sm border border-red-600 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
            on:click={() =>
              DisplayDialogue({
                header: 'Are you sure you want to delete this project?',
                headerStyles: 'text-xl mb-4 text-center underline',
                submitBtnStyles:
                  'border border-red-600 text-black p-1.5 rounded-sm hover:cursor-pointer hover:bg-red-600 hover:text-white mr-2 transition-colors',
                submitBtnText: 'Delete Project',
                onSubmit: deleteProject,
                buttons: [
                  {
                    title: 'Cancel',
                    stylingClasses:
                      'bg-black text-white p-1.5 rounded-sm hover:cursor-pointer mr-2',
                    onClick: () => CloseDialogue(),
                  },
                ],
                fields: [
                  {
                    type: 'text',
                    name: "Type 'CONFIRM' to confirm deletion",
                    id: 'confirm',
                    placeholder: '...',
                  },
                ],
              })}
          >
            Delete Project
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .projNameInput {
    max-width: 35ch;
  }
</style>
