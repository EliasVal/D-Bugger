<script>
  import { get, getAuth, getDatabase, push, ref, remove, set, update } from '@ts/FirebaseImports';
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
  import { fade, slide } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let addMemberID;

  let removeMember = async (member) => {
    DisplayLoading();
    await remove(ref(getDatabase(), `projects/${$project.id}/details/members/${member}`));
    CloseLoading();
  };

  let sendInvite = async () => {
    DisplayLoading();
    if ($project.details?.members?.includes(addMemberID)) {
      DisplayToast({ title: 'This user is already part of the project!', duration: 3000 });
      addMemberID = '';
      CloseLoading();
      return;
    } else if ($project.details?.pending?.includes(addMemberID)) {
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

    const inboxKey = await push(ref(getDatabase(), `users/${addMemberID}/inbox`), {
      sender: getAuth().currentUser.displayName,
      projectId: $project.id,
      read: false,
      type: 'invite',
    });

    await set(
      ref(getDatabase(), `projects/${$project.id}/details/pending/${addMemberID}`),
      inboxKey.key,
    );

    addMemberID = '';
    CloseLoading();
  };

  let cancelInvite = async (member) => {
    DisplayLoading();
    await remove(ref(getDatabase(), `users/${member}/inbox/${$project.details.pending[member]}`));
    await remove(ref(getDatabase(), `projects/${$project.id}/details/pending/${member}`));
    CloseLoading();
  };

  let deleteProject = (e) => {
    if (e.target[0].value === 'CONFIRM') dispatch('deleteProject');
    else DisplayToast({ title: "Please type 'CONFIRM' to confirm deletion.", duration: 3000 });
  };

  let tempProjName = $project.details.name;
</script>

<div>
  <div>
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
          <div class="inline" transition:fade|local={{ duration: 100 }}>
            <input
              class="text-black text-sm border border-red-600 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
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

    <div>
      <label for="members">Members:</label><br />
      <div class="flex flex-col">
        {#if $project.details?.members}
          <ul class="mt-2 mb-1" style="min-height: 40px">
            {#each Object.keys($project.details?.members) as member (member)}
              <li
                class="bg-black text-white px-2 py-1 rounded-md my-1"
                transition:slide|local
                animate:flip
              >
                <p class="text-left inline">
                  {#await get(ref(getDatabase(), `users/${member}/displayName`))}
                    (...) &bullet; {member}
                  {:then snapshot}
                    {#await snapshot.val()}
                      (...) &bullet; {member}
                    {:then name}
                      {name} &bullet; {member}
                    {/await}
                  {/await}
                </p>
                <button
                  type="button"
                  on:click={() => removeMember(member)}
                  class="float-right font-mono text-gray-400 hover:text-red-500">x</button
                >
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
    <div>
      <label for="pending">Pending Invites:</label><br />
      <div class="flex flex-col">
        {#if $project.details?.pending}
          <ul class="mt-2 mb-1" style="min-height: 40px">
            {#each Object.keys($project.details?.pending) as member (member)}
              <li
                class="bg-black text-white px-2 py-1 rounded-md my-1"
                transition:slide|local
                animate:flip
              >
                <p class="text-left inline">
                  {#await get(ref(getDatabase(), `users/${member}/displayName`))}
                    (...) &bullet; {member}
                  {:then snapshot}
                    {#await snapshot.val()}
                      (...) &bullet; {member}
                    {:then name}
                      {name} &bullet; {member}
                    {/await}
                  {/await}
                </p>
                <button
                  type="button"
                  on:click={() => cancelInvite(member)}
                  class="float-right font-mono text-gray-400 hover:text-red-500">x</button
                >
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      <form on:submit|preventDefault={() => sendInvite()}>
        <input
          class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none"
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
              onSubmit: () => deleteProject,
              buttons: [
                {
                  title: 'Cancel',
                  stylingClasses: 'bg-black text-white p-1.5 rounded-sm hover:cursor-pointer mr-2',
                  onClick: () => CloseDialogue(),
                },
              ],
              fields: [
                {
                  type: 'text',
                  name: "Type 'CONFIRM' to confirm deletion",
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

<style>
  .projNameInput {
    width: 35ch;
  }
</style>
