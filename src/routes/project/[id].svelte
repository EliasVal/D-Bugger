<script context="module">
  export async function load({ page }) {
    return { props: { slug: page.params.id }, status: 200 };
  }
</script>

<script lang="ts">
  import type { Bug, DialogueField } from 'src/global';

  import ProjectMain from '/src/Components/Project/ProjectMain.svelte';
  import ProjectSettings from '/src/Components/Project/ProjectSettings.svelte';
  import { fade } from 'svelte/transition';
  import { project, user, isDisplayingBug, isDisplayingProjectSettings } from '../../ts/stores';
  import {
    getDatabase,
    onValue,
    ref,
    remove,
    set,
    push,
    update,
    get,
  } from '../../ts/FirebaseImports';

  import {
    CloseDialogue,
    CloseLoading,
    DisplayLoading,
    DisplayDialogue,
    DisplayToast,
  } from '../../ts/utils';

  import Loading from '/src/Components/Loading.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let slug;

  const db = getDatabase();

  const createBugFields: DialogueField[] = [
    {
      type: 'text',
      placeholder: 'Enter title...',
      name: 'Bug title',
      id: 'bugTitle',
    },
    {
      type: 'choice',
      placeholder: '',
      name: 'Severity',
      options: [
        {
          text: 'Low',
          value: 'low',
        },
        {
          text: 'Medium',
          value: 'medium',
        },
        {
          text: 'High',
          value: 'high',
        },
        {
          text: 'Severe',
          value: 'severe',
        },
      ],
      id: 'bugSeverity',
    },
    {
      type: 'choice',
      placeholder: '',
      name: 'Status',
      options: [
        {
          text: 'On Hold',
          value: 'onHold',
        },
        {
          text: 'Fixed',
          value: 'fixed',
        },
        {
          text: 'Being Fixed',
          value: 'beingFixed',
        },
        {
          text: 'Abandoned',
          value: 'abandoned',
        },
      ],
      id: 'bugStatus',
    },
  ];

  let currUser = 'loading';
  onMount(async () => {
    $isDisplayingProjectSettings = false;
    $isDisplayingBug = false;
    user.subscribe((u) => {
      if (u != 'unknown' && u) {
        // @ts-ignore
        if (!u.emailVerified) {
          goto('/');
        }
        onValue(ref(db, `projects/${slug}`), async (snapshot) => {
          project.set({ ...(await snapshot.val()), id: slug });
          currUser = u;
        });
      }
    });
  });

  const displayDeleteBug = (e) => {
    DisplayDialogue({
      header: 'Are you sure you want to delete this bug?',
      onSubmit: () => deleteBug(e),
      submitBtnText: 'Confirm',
      buttons: [
        {
          title: 'Cancel',
          onClick: CloseDialogue,
        },
      ],
    });
  };

  const deleteBug = async (e) => {
    CloseDialogue();
    const id = e.detail.id;

    DisplayLoading();
    await remove(ref(db, `projects/${slug}/bugs/${id}`));
    $isDisplayingBug = false;
    CloseLoading();
    DisplayToast({ title: 'Bug Deleted Successfully!', duration: 5000 });
  };

  // Saving Changes
  const saveBugChanges = async (e) => {
    const bug: Bug = e.detail.bug;
    console.log(bug);
    DisplayLoading();
    await set(ref(db, `projects/${slug}/bugs/${bug.id}`), bug).catch(() => {
      CloseLoading();
      DisplayDialogue({
        header: 'Something Went Wrong!',
        submitBtnText: 'Okay!',
        onSubmit: () => CloseDialogue,
      });
      return;
    });
    CloseLoading();
    DisplayToast({ title: 'Saved Successfully!', duration: 5000 });
  };

  // Creating Bug
  const displayCreateBug = () => {
    DisplayDialogue({
      onSubmit: () => createBug,
      submitBtnText: 'Create',
      fields: createBugFields,
      buttons: [
        {
          title: 'Cancel',
          onClick: CloseDialogue,
        },
      ],
    });
  };

  const createBug = async (e) => {
    CloseDialogue();
    const bug: Bug = {
      id: '...',
      title: e.target[0].value,
      details: {
        severity: e.target[1].value,
        status: e.target[2].value,
      },
    };

    DisplayLoading();
    let res = await push(ref(db, `projects/${slug}/bugs`), { ...bug });
    await update(res.ref, { id: res.key });
    CloseLoading();
    DisplayToast({ title: 'Bug Created Successfully!', duration: 5000 });
  };

  const deleteProject = async () => {
    CloseDialogue();
    DisplayLoading();

    // Delete project from DB
    await remove(ref(db, `projects/${slug}`));

    // @ts-ignore
    // Get user's projects
    let userProjects = await get(ref(db, `users/${currUser.uid}/projects`));

    // Await value
    userProjects = await userProjects.val();

    // @ts-ignore
    // Remove deleted project's ID
    userProjects = userProjects.filter((proj) => proj != slug);

    // @ts-ignore
    // Push changes
    await set(ref(db, `users/${currUser.uid}/projects`), userProjects);
    CloseLoading();
    DisplayToast({ title: 'Project Deleted Successfully.', duration: 5000 });
    goto('/');
  };
</script>

<svelte:head>
  <title>D-Bugger | {$project?.details?.name == null ? 'Loading' : $project.details.name}</title>
  <style>
    body,
    html,
    #svelte {
      height: 100%;
      overflow-x: hidden;
    }
  </style>
</svelte:head>

{#if $project}
  {#if !$isDisplayingProjectSettings}
    {#if currUser == 'loading'}
      <div class="bg-gray-900 fixed w-full h-full" out:fade>
        <Loading />
      </div>
    {:else}
      <ProjectMain
        on:deleteBug={displayDeleteBug}
        on:createBug={displayCreateBug}
        on:saveBugChanges={saveBugChanges}
      />
    {/if}
  {:else}
    <ProjectSettings on:deleteProject={deleteProject} />
  {/if}
{/if}
