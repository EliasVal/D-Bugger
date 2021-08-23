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

	import { user, isDisplayingDialogue, dialogueValues, isDisplayingLoading } from '../ts/stores';
	import Navbar from '/src/Components/Navbar.svelte';
	import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
	import Loading from '/src/Components/Loading.svelte';

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

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
