<script>
	// @ts-nocheck

	import { user } from '../ts/stores';
	import { signOut, getAuth } from 'firebase/auth';
	import { goto } from '$app/navigation';

	import { icon } from '@fortawesome/fontawesome-svg-core';
	import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

	import { page } from '$app/stores';

	const SignOut = () => signOut(getAuth());
</script>

{#if !$page.path.match(/(login)|(signup)/gim)}
	<nav class="flex justify-between p-4 items-center bg-black text-white sticky top-0 z-10">
		{#if $user}
			<h3 class="inline">
				Welcome, <strong>{$user?.displayName ?? '...'}</strong>
			</h3>
			<div class="flex navList">
				<a class="px-2 sm:px-4" href="#projects">Projects</a>
				<a class="px-2 sm:px-4" href="#about">About Us</a>
				<a class="px-2 sm:px-4" href="#roadmap">Roadmap</a>
			</div>
			<button
				on:click={SignOut}
				class="bg-red-600 rounded-sm px-2 py-1 text-white hover:bg-red-800 transition-colors"
				title="Sign out"
			>
				{@html icon(faSignOutAlt).html}
			</button>
		{:else}
			<h3 class="inline">
				Welcome, <strong>User</strong>
			</h3>
			<button
				on:click={() => goto('/login')}
				class="bg-green-500 rounded-sm px-2 py-1 text-white hover:bg-green-800 transition-colors"
				title="Sign in"
			>
				{@html icon(faSignInAlt).html}
			</button>
		{/if}
	</nav>
{/if}

<style>
	.navList a:nth-child(odd) {
		border-right: 1px solid white;
		border-left: 1px solid white;
	}
</style>
