<script>
	import Navbar from '/src/Components/Project/Navbar.svelte';

	import {
		isDisplayingDialogue,
		dialogueValues,
		isDisplayingLoading,
		Toasts
	} from '../../ts/stores';

	import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
	import Loading from '/src/Components/Loading.svelte';
	import ToastMessage from '/src/Components/ToastMessage.svelte';

	import { fly, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const removeToast = (e) => {
		const id = e.detail.id;

		Toasts.set($Toasts.filter((toast) => toast.id !== id));
	};
</script>

<Navbar />
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
