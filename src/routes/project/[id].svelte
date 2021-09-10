<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Query } from '@firebase/database';

  import {
    get,
    getDatabase,
    limitToFirst,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    onValue,
    orderByKey,
    push,
    query,
    ref,
    remove,
    set,
    startAt,
    update,
  } from '@ts/FirebaseImports';

  import { base, isDisplayingBug, isDisplayingProjectSettings, project, user } from '@ts/stores';

  import {
    CloseDialogue,
    CloseLoading,
    DisplayDialogue,
    DisplayLoading,
    DisplayToast,
  } from '@ts/utils';

  import type { Bug, DialogueField } from 'src/global';

  import { onMount } from 'svelte';

  import { fade } from 'svelte/transition';
  import Loading from '/src/Components/Loading.svelte';
  import ProjectMain from '/src/Components/Project/ProjectMain.svelte';
  import ProjectSettings from '/src/Components/Project/ProjectSettings.svelte';

  const slug = $page.params.id;

  const db = getDatabase();

  const createBugFields: DialogueField[] = [
    {
      type: 'text',
      placeholder: 'Enter title...',
      name: 'Bug title',
      id: 'bugTitle',
    },
    {
      type: 'editor',
      placeholder: 'Enter description...',
      name: 'Bug Description',
      id: 'bugDesc',
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

  onMount(async () => {
    $isDisplayingProjectSettings = false;
    $isDisplayingBug = false;
  });

  let bugsLength;
  let pageKeys = [null];
  let pageIndex = 0;
  user.subscribe((u) => {
    let listening = false;
    onValue(ref(db, `projects/${slug}`), async (snapshot) => {
      const val = await snapshot.val();
      if (u && !u.emailVerified && (val.details.owner == u.uid || u.uid in val.details.members))
        goto(base);
      // project.set({ ...val, id: slug });

      // @ts-ignore
      if (!$project) $project = { bugs: {}, details: {} };
      $project.details = await snapshot.child('/details').val();
      $project.id = slug;

      let count = 0;
      // @ts-ignore
      snapshot.child('/bugs').forEach((bug) => {
        if (count % 25 == 0 && count != 0) {
          pageKeys.push(bug.val().id);
        }
        count++;
      });
      bugsLength = snapshot.child('/bugs').size;

      if (!listening) {
        updateListeners(query(ref(db, `projects/${slug}/bugs`), startAt(null), limitToFirst(25)));
      }
    });
  });

  let listeners = [];
  const updateListeners = (queryRef: Query) => {
    // Unsubscribe all the listeners
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
    // Empty the listners array
    listeners = [];

    // Empty the bugs array
    $project.bugs = {};

    // Subscribe to new listeners.
    listeners[listeners.length] = onChildAdded(queryRef, async (data) => {
      if (pageKeys[pageIndex] != data.key) {
        $project.bugs[data.key] = await data.val();
      }
    });
    listeners[listeners.length] = onChildChanged(queryRef, async (data) => {
      $project.bugs[data.key] = await data.val();
    });
    listeners[listeners.length] = onChildRemoved(queryRef, async (data) => {
      delete $project.bugs[data.key];
    });
  };

  const changePage = (e) => {
    DisplayLoading();
    pageIndex = e.detail.index;
    updateListeners(
      pageIndex > 0
        ? query(
            ref(db, `projects/${slug}/bugs`),
            orderByKey(),
            startAt(pageKeys[pageIndex]),
            limitToFirst(25),
          )
        : query(ref(db, `projects/${slug}/bugs`), startAt(pageKeys[pageIndex]), limitToFirst(25)),
    );
    CloseLoading();
  };

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
    console.log(e.detail);
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
    DisplayLoading();
    await set(ref(db, `projects/${slug}/bugs/${bug.id}`), bug).catch(() => {
      CloseLoading();
      DisplayDialogue({
        header: 'Something Went Wrong!',
        submitBtnText: 'Okay!',
        onSubmit: CloseDialogue,
      });
      return;
    });
    CloseLoading();
    DisplayToast({ title: 'Saved Successfully!', duration: 5000 });
  };

  // Creating Bug
  const displayCreateBug = () => {
    DisplayDialogue({
      onSubmit: createBug,
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
      title: e.target.querySelector('#bugTitle').value,
      details: {
        severity: e.target.querySelector('#bugSeverity').value,
        status: e.target.querySelector('#bugStatus').value,
        description: e.target.querySelector('textarea').value,
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
    let userProjects = await get(ref(db, `users/${$user.uid}/projects`));

    // Await value
    userProjects = await userProjects.val();

    // @ts-ignore
    // Remove deleted project's ID
    userProjects = userProjects.filter((proj) => proj != slug);

    // @ts-ignore
    // Push changes
    await set(ref(db, `users/${$user.uid}/projects`), userProjects);
    CloseLoading();
    DisplayToast({ title: 'Project Deleted Successfully.', duration: 5000 });
    goto(base);
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

{#if $project?.id}
  {#if !$isDisplayingProjectSettings}
    {#if $user == 'loading'}
      <div class="bg-gray-900 fixed w-full h-full" out:fade>
        <Loading />
      </div>
    {:else}
      <ProjectMain
        on:deleteBug={displayDeleteBug}
        on:createBug={displayCreateBug}
        on:saveBugChanges={saveBugChanges}
        on:changePage={changePage}
        {bugsLength}
      />
    {/if}
  {:else}
    <ProjectSettings on:deleteProject={deleteProject} />
  {/if}
{/if}
