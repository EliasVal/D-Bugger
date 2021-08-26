<script lang="ts">
	import { faSignOutAlt, faHome, faCog } from '@fortawesome/free-solid-svg-icons';
	import { icon } from '@fortawesome/fontawesome-svg-core';
	import { signOut, getAuth } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { isDisplayingProjectSettings } from '/src/ts/stores';

	let show = false;

	onMount(() => {
		setTimeout(() => (show = true), 500);
	});
</script>

<nav class="flex justify-between p-4 items-center bg-black text-white sticky top-0 z-10">
	<div class="mx-auto relative h-full">
		{#if show}
			<div class="border-r-2 border-white absolute left-1/2 top-0 bottom-0" in:slide />
		{/if}

		<button class="btnL px-4 text-xl" title="Home" on:click={() => goto('/')}>
			{@html icon(faHome).html}
		</button>
		<button
			class="btnR px-4 text-xl"
			title="Project Settings"
			on:click={() => ($isDisplayingProjectSettings = !$isDisplayingProjectSettings)}
		>
			{@html icon(faCog).html}
		</button>
	</div>
	<button
		on:click={() => signOut(getAuth()).then(() => goto('/'))}
		class="bg-red-600 absolute right-4 rounded-sm px-2 py-1 text-white hover:bg-red-800 transition-colors"
		title="Sign out"
	>
		{@html icon(faSignOutAlt).html}
	</button>
</nav>

<style>
	nav {
		min-height: 60px;
	}

	@keyframes animLeft {
		0% {
			color: transparent;
			transform: translateX(50%);
		}
		100% {
			color: white;
			transform: translateX(0);
		}
	}

	@keyframes animRight {
		0% {
			color: transparent;
			transform: translateX(-50%);
		}
		100% {
			color: white;
			transform: translateX(0);
		}
	}

	.btnL {
		animation: animLeft 1s ease 1s forwards;
		color: transparent;
	}
	.btnR {
		animation: animRight 1s ease 1s forwards;
		color: transparent;
	}
</style>
