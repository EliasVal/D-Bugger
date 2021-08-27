<script>
	// @ts-nocheck

	import { user } from '../ts/stores';
	import { signOut, getAuth } from '../ts/FirebaseImports';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	import { icon } from '@fortawesome/fontawesome-svg-core';
	import {
		faSignInAlt,
		faSignOutAlt,
		faBars,
		faRoute,
		faTasks,
		faBook,
		faUser
	} from '@fortawesome/free-solid-svg-icons';

	import { page } from '$app/stores';

	const SignOut = () => signOut(getAuth());

	let bWidth;
	let isDisplaying = true;
	let btnHeight;

	$: if (bWidth > 640) isDisplaying = true;
</script>

<svelte:window bind:innerWidth={bWidth} />

{#if bWidth < 640}
	<button
		class="navBtn bg-black fixed z-20 text-white border top-3 left-3 border-gray-300 px-2 py-0.5 rounded-md text-xl"
		on:click={() => (isDisplaying = !isDisplaying)}
		bind:offsetHeight={btnHeight}
	>
		{@html icon(faBars).html}
	</button>
{/if}

{#if !$page.path.match(/(login)|(signup)/gim)}
	{#if bWidth > 640 || isDisplaying}
		<nav
			class="p-3 bg-black text-white fixed z-10 top-0 bottom-0 sm:bottom-auto sm:right-0 sm:left-0 text-xl sm:text-base"
			transition:fly={{ x: bWidth < 640 && -75, y: bWidth > 640 && -75, duration: 1000 }}
		>
			<div
				class="flex flex-col sm:flex-row justify-between items-center"
				style="margin-top: {bWidth < 640 ? btnHeight + 10 : 0}px;
			height: calc(100% - {bWidth < 640 ? btnHeight + 10 : 0}px)"
			>
				{#if bWidth > 640 && $user}
					<button class="px-2 py-1">{@html icon(faUser).html}</button>
				{:else}
					<span />
				{/if}
				{#if $page.path == '/'}
					<div class="flex flex-col sm:flex-row gap-5 sm:gap-10 items-center">
						<a href="#projects" title="Projects">{@html icon(faTasks).html}</a>
						<a href="#about" title="About">{@html icon(faBook).html}</a>
						<a href="#roadmap" title="Roadmap">{@html icon(faRoute).html}</a>
					</div>
				{:else}{/if}
				{#if $user}
					<button
						on:click={SignOut}
						class="bg-red-600 rounded-sm px-2 py-1 text-white hover:bg-red-800 transition-colors"
						title="Sign out"
					>
						{@html icon(faSignOutAlt).html}
					</button>
				{:else}
					<button
						on:click={() => goto('/login')}
						class="bg-green-500 rounded-sm px-2 py-1 text-white hover:bg-green-800 transition-colors"
						title="Sign in"
					>
						{@html icon(faSignInAlt).html}
					</button>
				{/if}
			</div>
		</nav>
	{/if}
{/if}
