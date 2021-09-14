<script>
  import {
    browserLocalPersistence,
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
  } from '@ts/FirebaseImports';
  import { Circle } from 'svelte-loading-spinners';
  import { base } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';

  let isSigningIn = false;
  const signIn = (e) => {
    if (!e.target[0].value) {
      DisplayToast({ title: 'Please enter your E-Mail!' });
      return;
    } else if (!e.target[1].value) {
      DisplayToast({ title: 'Please enter your password!' });
      return;
    }

    isSigningIn = true;

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, e.target[0].value, e.target[1].value)
        .then(() => {
          window.location.pathname = base;
        })
        .catch((e) => {
          switch (e.code.substring(5)) {
            case 'user-not-found':
              DisplayToast({ title: 'This user does not exist!' });
              break;
            case 'invalid-email':
              DisplayToast({ title: 'Invalid E-Mail entered!' });
              break;
            case 'too-many-requests':
              DisplayToast({
                title: "Due to unusual activity, you've been timed out. Please try again later.",
              });
              break;
            case 'wrong-password':
              DisplayToast({ title: 'Incorrect password entered!' });
              break;
            case 'internal-error':
              DisplayToast({ title: 'Something went wrong!' });
              break;
            default:
              DisplayToast({ title: e.message });
              break;
          }

          isSigningIn = false;
        });
    });
  };
</script>

<svelte:head>
  <meta name="title" content="D-Bugger | Log in" />
</svelte:head>
<div class="bg-main w-full h-full flex items-center justify-around">
  <div class="bg-white px-4 py-10 w-max flex flex-col rounded-md shadow-2xl">
    <h1 class="text-center mb-auto font-light text-4xl">D-Bugger | Log-in</h1>

    <form
      on:submit|preventDefault={signIn}
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
      <div>
        <label for="password">Password: </label><br />
        <input
          id="password"
          class="p-1 outline-none rounded font-mono w-full border border-black"
          type="password"
        />
      </div>

      {#if !isSigningIn}
        <input
          class="self-center p-1.5 rounded-sm hover:cursor-pointer bg-black text-white mt-auto"
          type="submit"
          value="Submit"
        />

        <h4 class="self-center">
          <a href="{base}auth/resetPassword" class="wavy-underline">
            <strong>Forgot Password?</strong>
          </a>
        </h4>

        <h4 class="self-center">
          Don't have an account?
          <a href="{base}auth/signup" class="wavy-underline">
            <strong>Sign up</strong>
          </a>
        </h4>
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

  .wavy-underline {
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-skip-ink: none;
    text-decoration-thickness: 0;
  }
</style>
