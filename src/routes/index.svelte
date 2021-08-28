<script lang="ts">
	// Types
	import type { DialogueField } from 'src/global';

	// Packages & Libs
	import { getDatabase, getAuth, ref, onValue, update, get, set } from '../ts/FirebaseImports';

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
		CloseLoading
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
			maxlength: 20
		}
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
					stylingClasses: 'bg-transparent'
				}
			]
		});
	};
	const createProject = (event: Event) => {
		CloseDialogue();
		const genId = MakeId(16);

		DisplayLoading();
		update(ref(db, `/projects/${genId}`), {
			details: {
				name: event.target[0].value,
				owner: auth.currentUser.uid
			}
		}).then((e) => {
			get(ref(db, `/users/${auth.currentUser.uid}/projects`)).then(async (snapshot) => {
				let userProjects: Array<string> = (await snapshot.val()) ?? [];
				userProjects.push(genId);
				set(ref(db, `/users/${auth.currentUser.uid}/projects`), userProjects).then((e) => {
					goto(`/projects/${genId}`);
					CloseLoading();
				});
			});
		});
	};

	onMount(() => {
		if (!showProjects) return;
		let projectsDiv = document.getElementById('projectsContainer');
		let nav = document.getElementsByTagName('nav')[0];
		projectsDiv.parentElement.style.minHeight = `calc(100vh - ${nav.offsetHeight}px - 8em)`;

		user.subscribe((u) => {
			if (u && u != 'unknown') {
				// @ts-ignore
				onValue(ref(db, `users/${$user.uid}`), async (snapshot) => {
					let tmp = await snapshot.val().projects;

					if (tmp) {
						await tmp.map((projId) => {
							onValue(ref(db, `projects/${projId}`), async (projSnapshot) => {
								let tmpProjectData = await projSnapshot.val();
								if (tmpProjectData) {
									projects.update((p) => (p = [...p, { ...tmpProjectData, id: projId }]));
								}
							});
						});
					} else $projects = null;
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
	<div class="m-16" id="projects">
		<div class="flex flex-wrap justify-around gap-x-6 gap-y-10" id="projectsContainer">
			{#if $projects?.length > 0}
				{#each $projects as project}
					<ProjectCard projectName={project.details.name} projectId={project.id} />
				{/each}
			{:else if $projects == ''}
				<p>Loading...</p>
			{/if}
			{#if $projects != ''}
				<div
					class="projectCard border rounded-md border-gray-900 border-dotted w-48 h-28 p-2 flex flex-col justify-between hover:cursor-pointer"
					on:click={() => displayCreateProjectDialogue()}
				>
					<h1>+ Create Project</h1>
				</div>
			{/if}
		</div>
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
</style>
