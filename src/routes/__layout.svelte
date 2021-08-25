<script context="module">
	export async function load({ page }) {
		return {
			props: { pathIsLoginOrSignup: page.path.includes('login') || page.path.includes('signup') },
			status: 200
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	import { fly, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import {
		user,
		isDisplayingDialogue,
		dialogueValues,
		isDisplayingLoading,
		Toasts
	} from '../ts/stores';

	import { DisplayToast } from '../ts/utils';

	import Navbar from '/src/Components/Navbar.svelte';
	import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
	import Loading from '/src/Components/Loading.svelte';
	import ToastMessage from '/src/Components/ToastMessage.svelte';

	export let pathIsLoginOrSignup;

	user.subscribe((u) => {
		if (browser && u != 'unknown') {
			if (!u && !pathIsLoginOrSignup) {
				DisplayToast({ title: 'Log in to view your projects.', duration: 20000 });
			} else if (u && pathIsLoginOrSignup) {
				DisplayToast({ title: "You're already logged in.", duration: 5000 });
				goto('/');
			}
		}
	});

	const removeToast = (e) => {
		const id = e.detail.id;

		Toasts.set($Toasts.filter((toast) => toast.id !== id));
	};
</script>

{#if !pathIsLoginOrSignup}
	<Navbar />
{/if}
<slot />
{#if $isDisplayingDialogue}
	<Dialogue {...$dialogueValues} />
{/if}
{#if $isDisplayingLoading}
	<Loading />
{/if}

<div class="sticky inset-0">
	<div class="absolute bottom-0 left-0 m-3 flex flex-col gap-3">
		{#each $Toasts as toast (toast.id)}
			<div in:slide out:fly={{ x: -500 }} animate:flip={{ duration: 500 }}>
				<ToastMessage {toast} on:removeToast={removeToast} />
			</div>
		{/each}
	</div>
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	:global(html, body, #svelte) {
		scroll-behavior: smooth;
	}
</style>
