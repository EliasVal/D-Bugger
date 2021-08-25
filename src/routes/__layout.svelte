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

	import {
		user,
		isDisplayingDialogue,
		dialogueValues,
		isDisplayingLoading,
		Toasts
	} from '../ts/stores';

	import Navbar from '/src/Components/Navbar.svelte';
	import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
	import Loading from '/src/Components/Loading.svelte';
	import ToastMessage from '/src/Components/ToastMessage.svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let pathIsLoginOrSignup;

	user.subscribe((u) => {
		if (browser && u != 'unknown') {
			if (!u && !pathIsLoginOrSignup) {
				goto('/login');
			} else if (u && pathIsLoginOrSignup) {
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

<div class="absolute bottom-0 left-0 m-3 flex flex-col gap-3">
	{#each $Toasts as toast (toast.id)}
		<div in:slide out:fly={{ x: -500 }} animate:flip={{ duration: 500 }}>
			<ToastMessage {toast} on:removeToast={removeToast} />
		</div>
	{/each}
</div>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
