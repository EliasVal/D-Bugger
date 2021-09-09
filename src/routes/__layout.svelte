<script>
  import { goto } from '$app/navigation';
  import { base } from '@ts/stores';
  import { page } from '$app/stores';

  import {
    dialogueValues,
    isDisplayingDialogue,
    isDisplayingLoading,
    Toasts,
    user,
  } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';

  import { flip } from 'svelte/animate';
  import { fly, slide } from 'svelte/transition';

  import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
  import Loading from '/src/Components/Loading.svelte';
  import Navbar from '/src/Components/Navbar.svelte';
  import ToastMessage from '/src/Components/ToastMessage.svelte';

  user.subscribe((u) => {
    if (u && !u.emailVerified) {
      DisplayToast({
        title: 'Please verify your account',
        desc: `Check your E-Mail's inbox to verify your account.<br>Haven't received an E-Mail? <button onclick="window.location.pathname = '${base}auth/sendEmail'"><u>Click Here</u></button><br>Wrong E-Mail? You can change it in your profile page, accessed in the navbar.`,
        duration: 20000,
      });
    }
  });

  const removeToast = (e) => {
    const id = e.detail.id;

    Toasts.set($Toasts.filter((toast) => toast.id !== id));
  };
</script>

<Navbar />
<div id="slot" class="h-full sm:pt-14">
  <slot />
</div>
{#if $isDisplayingDialogue}
  <Dialogue {...$dialogueValues} />
{/if}
{#if $isDisplayingLoading}
  <Loading />
{/if}

<div class="fixed bottom-0 z-30">
  <div class="absolute bottom-0 left-0 m-3 flex flex-col gap-3">
    {#each $Toasts as toast (toast.id)}
      <div in:slide out:fly={{ x: -500 }} animate:flip={{ duration: 500 }}>
        <ToastMessage {toast} on:removeToast={removeToast} />
      </div>
    {/each}
  </div>
</div>

<style>
  :global(html, body, #svelte) {
    scroll-behavior: smooth;
    min-height: 100vh;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
