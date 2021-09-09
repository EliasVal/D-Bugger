<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  import { Toasts, user } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';

  import { flip } from 'svelte/animate';
  import { fly, slide } from 'svelte/transition';
  import ToastMessage from '/src/Components/ToastMessage.svelte';

  const removeToast = (e) => {
    const id = e.detail.id;

    Toasts.set($Toasts.filter((toast) => toast.id !== id));
  };

  user.subscribe((u) => {
    if (u && $page.path.match(/auth\/((login)|(signup)|(resetPassword))$/gim)) {
      DisplayToast({ title: "You're already logged in.", duration: 4000 });
      goto(base);
    }
  });
</script>

<slot />
<div class="fixed bottom-0 z-30">
  <div class="absolute bottom-0 left-0 m-3 flex flex-col gap-3">
    {#each $Toasts as toast (toast.id)}
      <div in:slide out:fly={{ x: -500 }} animate:flip={{ duration: 500 }}>
        <ToastMessage {toast} on:removeToast={removeToast} />
      </div>
    {/each}
  </div>
</div>
