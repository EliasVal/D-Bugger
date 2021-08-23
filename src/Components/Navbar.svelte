<script context="module">
	import { user } from '../ts/stores';
	import { signOut, getAuth } from 'firebase/auth';
</script>

<script>
	// @ts-nocheck

	import { page } from '$app/stores';

	const SignOut = () => signOut(getAuth());
</script>

{#if !$page.path.match(/(login)|(signup)/gim)}
	<nav class="flex justify-between p-4 items-center bg-blue-600 text-white sticky top-0 z-10">
		<h3 class="inline">
			Welcome, <strong>{$user?.displayName ?? '...'}</strong>
		</h3>
		<button
			on:click={SignOut}
			class="bg-red-600 rounded px-2 py-1 text-white hover:bg-red-800 transition-colors"
			>Sign out</button
		>
	</nav>
{/if}
