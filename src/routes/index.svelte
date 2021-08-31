<script lang="ts">
  // Types
  import type { DialogueField } from 'src/global';

  // Packages & Libs
  import { getDatabase, getAuth, ref, onValue, get, set, push } from '../ts/FirebaseImports';
  import { Stretch } from 'svelte-loading-spinners';

  import { goto } from '$app/navigation';

  // Svelte
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  // Stores & Utils
  import {
    MakeId,
    DisplayDialogue,
    CloseDialogue,
    DisplayLoading,
    CloseLoading,
    DisplayToast,
  } from '../ts/utils';
  import { user } from '../ts/stores';

  // Components
  import ProjectCard from '../Components/ProjectCard.svelte';
  import About from '../Components/Home/About.svelte';
  import Thanks from '../Components/Home/Thanks.svelte';
  import Roadmap from '../Components/Home/Roadmap.svelte';

  const auth = getAuth();
  const db = getDatabase();

  let projects = writable([]);

  const fields: DialogueField[] = [
    {
      name: 'Project Name',
      id: 'projName',
      placeholder: 'Enter project name...',
      type: 'text',
      minlength: 3,
      maxlength: 20,
    },
  ];

  let showProjects = true;

  const displayCreateProjectDialogue = () => {
    DisplayDialogue({
      fields,
      onSubmit: () => createProject,
      submitBtnText: 'Create',
      buttons: [
        {
          title: 'Cancel',
          onClick: CloseDialogue,
          stylingClasses: 'bg-transparent',
        },
      ],
    });
  };
  const createProject = async (event: Event) => {
    if (event.target[0].value?.length < 3) {
      DisplayToast({ title: 'This field cannot be empty!', duration: 4000 });
      return;
    }

    CloseDialogue();

    DisplayLoading();
    const proj = await push(ref(db, `/projects`), {
      details: {
        name: event.target[0].value,
        owner: auth.currentUser.uid,
      },
    });

    let userProjects = await get(ref(db, `/users/${auth.currentUser.uid}/projects`));
    userProjects = (await userProjects.val()) ?? [];

    // @ts-ignore
    userProjects.push(proj.key);
    await set(ref(db, `/users/${auth.currentUser.uid}/projects`), userProjects);
    goto(`/project/${proj.key}`);
    CloseLoading();
  };

  let loading = true;
  onMount(() => {
    if (!showProjects) return;
    let projectsDiv = document.getElementById('projects');
    let nav = document.getElementsByTagName('nav')[0];
    projectsDiv.style.minHeight = `calc(100vh - ${nav.offsetHeight}px)`;

    user.subscribe((u) => {
      if (u && u != 'unknown') {
        // @ts-ignore
        onValue(ref(db, `users/${$user.uid}/projects`), async (snapshot) => {
          const projectArr = await snapshot.val();

          if (projectArr) {
            $projects = [];
            await projectArr.map(async (projId) => {
              const projSnapshot = await get(ref(db, `projects/${projId}`));
              const projectData = await projSnapshot.val();
              if (projectData) {
                projects.update((p) => (p = [...p, { ...projectData, id: projId }]));
              }
            });
          } else $projects = null;
          if ($projects == []) $projects = null;
          loading = false;
        });
      } else if (!u) showProjects = false;
    });
  });
</script>

<svelte:head>
  <title>D-Bugger</title>
  <meta name="title" content="D-Bugger" />
  <meta
    name="Description"
    content="Log the bugs in your apps, coordiante with your team to give the end user the best experience."
  />
</svelte:head>

{#if showProjects}
  <div id="projects" class=" my-10">
    {#if !loading}
      {#if $projects?.length > 0}
        <h1 class="text-center text-4xl mb-10">Projects</h1>
      {/if}
      <div class="projectsContainer mx-12">
        {#if $projects?.length > 0}
          {#each $projects as project}
            <ProjectCard projectName={project.details.name} projectId={project.id} />
          {/each}
        {/if}
        <div
          class="projectCard border rounded-md border-gray-900 border-dotted w-48 h-28 p-2 flex flex-col justify-between hover:cursor-pointer"
          on:click={() => displayCreateProjectDialogue()}
        >
          <h1>+ Create Project</h1>
        </div>
      </div>
    {:else}
      <div class="flex justify-center items-center h-screen">
        <Stretch color="#000" />
      </div>
    {/if}
  </div>
  <hr class="w-full bg-black h-1" />
{/if}

<About />

<hr class="w-full bg-black h-1" />

<Roadmap />

<hr class="w-full bg-black h-1" />

<Thanks />

<style>
  #projects {
    scroll-margin-top: 12rem;
  }

  .projectsContainer {
    display: grid;
    grid-template-columns: repeat(auto-fill, 12rem);
    justify-content: center;
    align-items: flex-start;
    row-gap: 1.5rem;
    column-gap: 2.5rem;
  }
</style>
