<script>
  import { project } from '/src/ts/stores';
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';
  import {
    DisplayToast,
    DisplayDialogue,
    CloseDialogue,
    DisplayLoading,
    CloseLoading,
  } from '/src/ts/utils';
  import { createEventDispatcher } from 'svelte';
  import { get, getDatabase, ref, set, remove, getAuth } from '/src/ts/FirebaseImports';

  const dispatch = createEventDispatcher();

  let addMemberID;

  let removeMember = (member) => {
    $project.details.members = $project.details?.members.filter((m) => m != member);
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

    $project.details.pending = $project.details?.pending
      ? [...$project.details?.pending, addMemberID]
      : [addMemberID];

    await set(ref(getDatabase(), `users/${addMemberID}/inbox/invites/${$project.id}`), {
      sender: getAuth().currentUser.uid,
      read: false,
    });

    await set(
      ref(getDatabase(), `projects/${$project.id}/details/pending`),
      $project.details.pending,
    );

    addMemberID = '';
    CloseLoading();
  };

  let cancelInvite = async (member) => {
    DisplayLoading();
    $project.details.pending = $project.details.pending.filter((m) => m != member);
    await remove(ref(getDatabase(), `users/${member}/inbox/invites/${$project.id}`));
    await set(
      ref(getDatabase(), `projects/${$project.id}/details/pending`),
      $project.details.pending,
    );
    CloseLoading();
  };

  let deleteProject = (e) => {
    if (e.target[0].value === 'CONFIRM') dispatch('deleteProject');
    else DisplayToast({ title: "Please type 'CONFIRM' to confirm deletion.", duration: 3000 });
  };
</script>

<div>
  <form on:submit|preventDefault={() => {}}>
    <div>
      <label for="projectName">Project Name</label>
      <input
        class="border border-black rounded-sm pl-1 outline-none font-mono w-full mt-1 mb-2"
        id="projectName"
        type="test"
        placeholder="Enter name..."
        minlength="3"
        bind:value={$project.details.name}
      />
    </div>

    <div>
      <label for="members">Members:</label><br />
      <div class="flex flex-col">
        {#if $project.details?.members?.length > 0}
          <ul class="mt-2 mb-1" style="min-height: 40px">
            {#each $project.details?.members as member (member)}
              <li
                class="bg-black text-white px-2 py-1 rounded-md my-1"
                transition:slide
                animate:flip
              >
                <p class="text-left inline">
                  {member}
                  {#await get(ref(getDatabase(), `users/${member}/displayName`))}
                    (...)
                  {:then snapshot}
                    {#await snapshot.val()}
                      (...)
                    {:then name}
                      ({name})
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
        {#if $project.details?.pending?.length > 0}
          <ul class="mt-2 mb-1" style="min-height: 40px">
            {#each $project.details?.pending as member (member)}
              <li
                class="bg-black text-white px-2 py-1 rounded-md my-1"
                transition:slide
                animate:flip
              >
                <p class="text-left inline">
                  {member}
                  {#await get(ref(getDatabase(), `users/${member}/displayName`))}
                    (...)
                  {:then snapshot}
                    {#await snapshot.val()}
                      (...)
                    {:then name}
                      ({name})
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
          placeholder="Enter name..."
          id="assignedTo"
          bind:value={addMemberID}
        />
        <input
          type="submit"
          value="Add"
          class="border-2 border-black px-2 py-0.5 rounded-sm bg-transparent hover:bg-black hover:text-white transition-colors hover:cursor-pointer w-full mt-1"
        />
      </form>
    </div>
    <div class="flex btns justify-center gap-3">
      <input
        class="bg-black text-white px-2 py-1 rounded-sm hover:cursor-pointer"
        type="submit"
        value="Save Changes"
      />
      <input
        class="text-black text-sm border border-black px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-black hover:text-white transition-colors"
        type="button"
        value="Cancel"
      />
    </div>
    {#if $project.details?.owner == getAuth().currentUser.uid}
      <div>
        <input
          type="button"
          value="Delete Project"
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
        />
      </div>
    {/if}
  </form>
</div>
