<script lang="ts">
	// Types
	import type { DialogueField } from 'src/global';

	// Packages & Libs
	import { getDatabase, ref, onValue, update, get, set } from 'firebase/database';
	import { getAuth } from 'firebase/auth';

	// $App
	import { browser } from '$app/env';
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
	import About from '../Components/About/About.svelte';

	let projects = writable([]);

	let auth;
	if (browser) {
		auth = getAuth();
	}
	const db = getDatabase();
	onMount(() => {
		let projectsDiv = document.getElementById('projects');
		let nav = document.getElementsByTagName('nav')[0];
		projectsDiv.parentElement.style.minHeight = `calc(100vh - ${nav.offsetHeight}px - 8em)`;
	});

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

	if (browser) {
		user.subscribe((u) => {
			if (u != 'unknown') {
				// @ts-ignore
				onValue(ref(db, `users/${$user.uid}`), async (snapshot) => {
					let tmp = await snapshot.val().projects;

					await tmp.map((projId) => {
						onValue(ref(db, `projects/${projId}`), async (projSnapshot) => {
							let tmpProjectData = await projSnapshot.val();
							if (tmpProjectData) {
								projects.update((p) => (p = [...p, { name: tmpProjectData.name, id: projId }]));
							}
						});
					});
				});
			}
		});
	}

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
			name: event.target[0].value,
			owner: auth.currentUser.uid
		}).then((e) => {
			get(ref(db, `/users/${auth.currentUser.uid}/projects`)).then(async (snapshot) => {
				let userProjects: Array<string> = await snapshot.val();
				userProjects.push(genId);
				set(ref(db, `/users/${auth.currentUser.uid}/projects`), userProjects).then((e) => {
					goto(`/projects/${genId}`);
					CloseLoading();
				});
			});
		});
	};
</script>

<div class="m-16">
	<div class="flex flex-wrap justify-around gap-x-6 gap-y-10" id="projects">
		{#if $projects.length > 0}
			{#each $projects as project}
				<ProjectCard projectName={project.name} projectId={project.id} />
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

<About />
