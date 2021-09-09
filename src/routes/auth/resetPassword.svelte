<script>
  let isSendingEmail;

  import { Circle } from 'svelte-loading-spinners';

  import { getAuth } from '@ts/FirebaseImports';
  import { sendPasswordResetEmail } from '@firebase/auth';
  import { DisplayToast } from '@ts/utils';

  const sendEmail = (e) => {
    isSendingEmail = true;
    sendPasswordResetEmail(getAuth(), e.target[0].value)
      .then(() => {
        DisplayToast({ title: 'E-Mail sent successfully!', duration: 4000 });
        isSendingEmail = false;
      })
      .catch((e) => {
        switch (e.code.substring(5)) {
          case 'invalid-email':
            DisplayToast({ title: 'Invalid E-Mail Entered!', duration: 4000 });
            break;
          case 'user-not-found':
            DisplayToast({ title: "A user with this E-Mail doesn't exist!", duration: 4000 });
            break;
        }
        isSendingEmail = false;
      });
  };
</script>

<div class="bg-main w-full h-full flex items-center justify-around">
  <div class="bg-white px-4 py-10 w-max flex flex-col rounded-md shadow-2xl">
    <h1 class="text-center mb-auto font-light text-3xl">D-Bugger | Reset Password</h1>

    <form
      on:submit|preventDefault={sendEmail}
      class="flex flex-col gap-5 mx-2 justify-center h-full pt-10"
    >
      <div class=" mt-auto">
        <label for="email">E-Mail: </label><br />
        <input
          id="email"
          class="p-1 outline-none rounded font-mono w-full border border-black"
          type="email"
        />
      </div>

      {#if !isSendingEmail}
        <input
          class="self-center p-1.5 rounded-sm hover:cursor-pointer bg-black text-white mt-auto"
          type="submit"
          value="Send"
        />
      {:else}
        <div class="self-center">
          <Circle size="30" color="#000000" duration="2s" />
        </div>
      {/if}
    </form>
  </div>
</div>

<style>
  :global(#svelte, html, body) {
    height: 100vh;
  }

  .bg-main {
    background-color: #171717;
  }
</style>
