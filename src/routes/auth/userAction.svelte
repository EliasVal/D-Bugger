<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    confirmPasswordReset,
    verifyPasswordResetCode,
    applyActionCode,
  } from '@ts/FirebaseImports';
  import { page } from '$app/stores';
  import { Stretch } from 'svelte-loading-spinners';
  import { slide } from 'svelte/transition';
  import { DisplayToast } from '@ts/utils';

  // Get the action to complete.
  const mode = $page.query.get('mode');
  // Get the one-time code from the query parameter.
  const actionCode = $page.query.get('oobCode');
  // Get Auth Object.
  let auth = getAuth();

  if (!mode || !actionCode || !mode.match(/^(resetPassword)|(verifyEmail)$/gim))
    window.location.pathname = '/';

  function handleResetPassword(email) {
    isChangingPass = true;
    confirmPasswordReset(auth, actionCode, newPass)
      .then(async () => {
        await signInWithEmailAndPassword(auth, email, newPass);
        window.location.pathname = '/';
      })
      .catch((error) => {
        switch (error.code.substring(5)) {
          case 'expired-action-code':
            DisplayToast({
              title: 'Expired Password reset E-Mail. Please try resetting your password again.',
            });
            break;
          case 'invalid-action-code':
            DisplayToast({
              title: 'Invalid Password reset E-Mail. Please try resetting your password again.',
            });
            break;
          case 'weak-password':
            DisplayToast({ title: 'Password too weak.' });
            break;
        }
        isChangingPass = false;
      });
  }

  let newPass;
  let confirmNewPass;
  let isChangingPass;
</script>

<div class="cont flex items-center justify-center">
  {#if mode == 'verifyEmail'}
    <!--Verify Action Code-->
    {#await applyActionCode(auth, actionCode)}
      <div class="w-3/4 md:w-3/12 h-full flex justify-center">
        <Stretch color="black" />
      </div>
    {:then}
      <h2>E-Mail Verified Successfully, you can now close this page.</h2>
    {:catch error}
      {#if error.code == 'auth/expired-action-code'}
        <h2>The verification E-Mail has expired, please try verifying your E-Mail again.</h2>
      {:else}
        <h2>Invalid Verification Code.</h2>
      {/if}
    {/await}
  {:else if mode == 'resetPassword'}
    <!--Verify Action Code-->
    {#await verifyPasswordResetCode(auth, actionCode)}
      <div class="w-3/4 md:w-3/12 h-full flex justify-center">
        <Stretch color="black" />
      </div>
    {:then email}
      <!--Show Reset Password form-->
      <form
        class="border border-gray-200 shadow-lg px-16 rounded-lg pb-12"
        on:submit|preventDefault={() => handleResetPassword(email)}
      >
        <h2 class="text-2xl text-center mb-10 mt-5">Reset Password</h2>
        <div class="flex flex-col gap-3">
          <div>
            <label for="username">New Password:</label><br />
            <input
              class="border border-black rounded-sm pl-1 outline-none font-mono w-full md:w-52 mt-1 mb-2"
              type="password"
              name="newPass"
              id="newPass"
              bind:value={newPass}
            />
          </div>
          <div>
            <label for="username">Confirm new Password:</label><br />
            <input
              class="border border-black rounded-sm pl-1 outline-none font-mono w-full md:w-52 mt-1 mb-2"
              type="password"
              name="confirmNewPass"
              id="confirmNewPass"
              bind:value={confirmNewPass}
            />
          </div>
          {#if isChangingPass}
            <Stretch color="black" />
          {:else if newPass == confirmNewPass && newPass?.length >= 3}
            <input
              class="border border-black rounded-sm pl-1 outline-none w-full md:w-52 hover:cursor-pointer bg-transparent hover:bg-black hover:text-white transition-colors"
              type="submit"
              value="Reset Password"
              transition:slide
            />
          {/if}
        </div>
      </form>
    {:catch error}
      {#if error.code == 'auth/expired-action-code'}
        <h2>The password reset E-Mail has expired, please try resetting your password again.</h2>
      {:else}
        <h2>Invalid Verification Code.</h2>
      {/if}
    {/await}
  {/if}
</div>

<style>
  .cont {
    min-height: calc(100vh - 56px);
  }
</style>
