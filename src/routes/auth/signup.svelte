<script lang="ts">
  import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    getAuth,
    getDatabase,
    ref,
    sendEmailVerification,
    set,
    setPersistence,
    updateProfile,
  } from '@ts/FirebaseImports';
  import { Circle } from 'svelte-loading-spinners';
  import { base } from '@ts/stores';
  import { DisplayToast } from '@ts/utils';

  let isSigningUp = false;
  const signIn = async (e: Event) => {
    if (!e.target[0].value || e.target[0].value.length < 3) {
      DisplayToast({
        title: 'You must enter a username that is atleast 3 characters long!',
      });
      return;
    } else if (!e.target[1].value) {
      DisplayToast({ title: 'Please enter your E-Mail!' });
      return;
    } else if (!e.target[2].value) {
      DisplayToast({ title: 'Please enter your password!' });
      return;
    }

    isSigningUp = true;
    let cleanUsername = e.target[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let isOffensiveName = cleanUsername.match(
      /(n(1|i)g+((e|3)r|a))|(fag)|(a(((s|5)(s|5))|(r(s|5)(e|3))))|(fuck)|(twat)|(cunt)|(b(1|i)tch)|((s|5)h(1|i)t)|(wh(0|o)r(e|3))|((s|5)(e|3)x)|(c(0|o)ck)|(pu(s|5)(s|5)y)|(p(e|3)n(1|i)(s|5))|(vag(1|i)na)|(cl(1|i)t)|(cum)|((s|5)(e|3)m(e|3)n)|((s|5)lut)|(p(e|3)d(0|o))|(m(0|o)l(e|3)(s|5)t)|(dyk(e|3))|(trap)|(h(1|i)tl(e|3)r)|(l(0|o)l(1|i))|((s|5)h(0|o)ta)|((s|5)u(1|i)c(1|i)d(e|3))|(wank(e|3)r)|(rap((e|3)|(1|i)(s|5)t))/gim,
    );

    if (isOffensiveName) {
      DisplayToast({
        title: 'Your username was deemed offensive. Please use a different username.',
      });
      isSigningUp = false;
      return;
    }

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence).then(() => {
      createUserWithEmailAndPassword(auth, e.target[1].value, e.target[2].value)
        .then(async () => {
          // Set username in user's profile
          await updateProfile(auth.currentUser, {
            displayName: e.target[0].value,
          });
          // Set username in user's DB
          await set(ref(getDatabase(), `users/${auth.currentUser.uid}`), {
            displayName: e.target[0].value,
          });

          await sendEmailVerification(auth.currentUser);

          // Redirect to index
          window.location.pathname = base;
        })
        .catch((e) => {
          switch (e.code.substring(5)) {
            case 'email-already-exists':
            case 'email-already-in-use':
              DisplayToast({ title: 'This user already exists!' });
              break;
            case 'too-many-requests':
              DisplayToast({
                title: "Due to unusual activity, you've been timed out. Please try again later.",
              });
              break;
            case 'internal-error':
              DisplayToast({ title: 'Something went wrong!' });
              break;
            case 'invalid-email':
              DisplayToast({ title: 'Invalid E-Mail entered!' });
              break;
            case 'weak-password':
              DisplayToast({ title: 'Your password is too weak!' });
              break;
            default:
              DisplayToast({ title: e.message });
              break;
          }
          isSigningUp = false;
        });
    });
  };
</script>

<svelte:head>
  <meta name="title" content="D-Bugger | Sign up" />
</svelte:head>
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
