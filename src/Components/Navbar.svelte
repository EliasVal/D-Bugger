<script context="module">
	import { user } from '../ts/stores';
	import { signOut, getAuth } from 'firebase/auth';
	import { goto } from '$app/navigation';
</script>

<script>
	// @ts-nocheck

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
				<a href="#projects">Projects</a>
				<a href="#about">About Us</a>
				<a href="">Roadmap</a>
			</div>
			<button
				on:click={SignOut}
				class="bg-red-600 rounded-sm px-2 py-1 text-white hover:bg-red-800 transition-colors"
			>
				Sign out
			</button>
		{:else}
			<h3 class="inline">
				Welcome, <strong>User</strong>
			</h3>
			<button
				on:click={() => goto('/login')}
				class="bg-green-500 rounded-sm px-2 py-1 text-white hover:bg-green-800 transition-colors"
			>
				Sign in
			</button>
		{/if}
	</nav>
{/if}

<style>
	.navList a:nth-child(odd) {
		border-right: 1px solid white;
		border-left: 1px solid white;
	}
	.navList a {
		padding: 0 1rem;
	}
</style>
