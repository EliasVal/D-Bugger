<script lang="ts">
  import {
    browserLocalPersistence,
    getAuth,
    sendEmailVerification,
    setPersistence,
    signInWithEmailAndPassword,
  } from '@ts/FirebaseImports';
  import { Circle } from 'svelte-loading-spinners';
  import { base } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';
  import SEO from '../../Components/SEO.svelte';

  let isSigningUp = false;
  const signIn = async (e: Event) => {
    isSigningUp = true;

    console.log(
      JSON.stringify({
        username: encodeURI(e.target[0].value),
        email: encodeURI(e.target[1].value),
        password: encodeURI(e.target[2].value),
      }),
    );
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).then(async () => {
      const res = await fetch('/endpoints/server/createUser', {
        method: 'POST',
        body: encodeURI(
          JSON.stringify({
            username: encodeURI(e.target[0].value),
            email: encodeURI(e.target[1].value),
            password: encodeURI(e.target[2].value),
          }),
        ),
      });

      const jsonRes = await res.json();
      DisplayToast({ title: jsonRes.message });
      if (res.status == 200) {
        signInWithEmailAndPassword(auth, e.target[1].value, e.target[2].value).then(async () => {
          await sendEmailVerification(auth.currentUser);
          isSigningUp = false;
          window.location.pathname = base;
        });
      } else {
        isSigningUp = false;
      }
    });
  };
</script>

<SEO title="D-Bugger | Sign-up" url="https://dbugger.me/auth/signup" />

<div class="bg-main w-full h-full flex items-center justify-around">
  <div class="bg-white px-4 py-10 w-max flex flex-col rounded-md shadow-2xl">
    <h4 class="text-center mb-auto font-light text-4xl">D-Bugger | Sign-up</h4>
    <form
      on:submit|preventDefault={signIn}
      class="flex flex-col gap-5 mx-2 justify-center h-full pt-10"
    >
      <div class="mt-auto">
        <label for="username">Username: </label><br />
        <input
          id="username"
          class="p-1 outline-none rounded font-mono w-full border border-black"
          type="text"
          maxlength="18"
        />
      </div>
      <div>
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
      {#if !isSigningUp}
        <input
          class="self-center p-1.5 rounded-sm hover:cursor-pointer bg-black text-white mt-auto"
          type="submit"
          value="Submit"
        />
        <h4 class="self-center">
          Already have an account? <a href="{base}auth/login" class="wavy-underline">
            <strong>Log-in</strong>
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
