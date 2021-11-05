<script>
  import { base } from '@ts/stores';

  import { dialogueValues, isDisplayingDialogue, isDisplayingLoading, user } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';

  import Dialogue from '/src/Components/Dialogue/Dialogue.svelte';
  import Loading from '/src/Components/Loading.svelte';
  import Navbar from '/src/Components/Navbar.svelte';
  import ToastContainer from '/src/Components/Toasts/ToastContainer.svelte';

  user.subscribe((u) => {
    if (u && !u.emailVerified) {
      DisplayToast({
        title: 'Please verify your account',
        description: `Check your E-Mail's inbox to verify your account.<br>Haven't received an E-Mail? <button onclick="window.location.pathname = '${base}auth/sendEmail'"><u>Click Here</u></button><br>Wrong E-Mail? You can change it in your profile page, accessed in the navbar.`,
        duration: 20000,
      });
    }
  });
</script>

<Navbar />
<div id="slot" class="min-h-full">
  <slot />
</div>
{#if $isDisplayingDialogue}
  <Dialogue {...$dialogueValues} />
{/if}
{#if $isDisplayingLoading}
  <Loading />
{/if}

<ToastContainer />

<style>
  :global(html, body, #svelte) {
    scroll-behavior: smooth;
    min-height: 100vh;
    overflow-x: hidden;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
