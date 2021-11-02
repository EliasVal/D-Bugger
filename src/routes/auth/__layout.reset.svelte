<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  import { user } from '@ts/stores';
  import ToastContainer from '/src/Components/Toasts/ToastContainer.svelte';

  user.subscribe((u) => {
    if (u && $page.path.match(/auth\/((login)|(signup)|(resetPassword))$/gim)) {
      goto(base);
    }
  });
</script>

<slot />
<ToastContainer />
