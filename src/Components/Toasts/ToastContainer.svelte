<script>
  import { Toasts } from '@ts/stores';

  import { flip } from 'svelte/animate';
  import { fly, slide } from 'svelte/transition';

  import ToastMessage from './ToastMessage.svelte';

  const removeToast = (e) => {
    const id = e.detail.id;

    Toasts.set($Toasts.filter((toast) => toast.id !== id));
  };
</script>

<div class="fixed top-0 right-0 sm:left-0 sm:bottom-0 sm:top-auto z-30 p-3">
  <div class="flex flex-col gap-3">
    {#each $Toasts as toast (toast.id)}
      <div
        in:slide
        out:fly={{ x: window.innerWidth > 640 ? -500 : 500 }}
        animate:flip={{ duration: 500 }}
      >
        <ToastMessage {toast} on:removeToast={removeToast} />
      </div>
    {/each}
  </div>
</div>
