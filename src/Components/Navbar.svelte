<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { base, imageCache } from '@ts/stores';

  import { icon } from '@ts/Singletons';
  import {
    faBars,
    faBook,
    faCog,
    faEnvelope,
    faHome,
    faRoute,
    faSignInAlt,
    faTasks,
    faUser,
  } from '@fortawesome/free-solid-svg-icons';

  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fly, slide, fade } from 'svelte/transition';

  import {
    getDatabase,
    onValue,
    ref,
    update,
    remove,
    storageRef,
    getDownloadURL,
    getStorage,
  } from '@ts/FirebaseImports';
  import { isDisplayingProjectSettings, project, user } from '@ts/stores';
  import { DisplayDialogue, CloseDialogue, DisplayLoading, CloseLoading } from '@ts/utils';

  import Message from './Message.svelte';

  let bWidth;
  let prevBWidth;
  let isDisplayingNavbar = false;
  let isDisplayingMessages = false;
  let hasUnread = false;
  let btnHeight;
  let callNavUpdate = {};

  const db = getDatabase();
  const messages = writable();

  onMount(() => {
    bWidth = window.innerWidth;
  });
  user.subscribe(async (u) => {
    if (u) {
      onValue(ref(db, `users/${u.uid}/inbox`), async (snapshot) => {
        messages.set(Object.fromEntries(Object.entries((await snapshot.val()) ?? {}).reverse()));
      });

      $imageCache = await getDownloadURL(storageRef(getStorage(), `${u.uid}/profilePicture`));
    }
  });

  $: {
    if ($messages) {
      let found = false;
      for (let val of Object.values($messages)) {
        if (val.read != true) {
          found = true;
          hasUnread = true;
          break;
        }
      }
      if (!found) hasUnread = false;
    } else hasUnread = false;

    if (bWidth < 640 && prevBWidth > 640) {
      isDisplayingNavbar = true;
      callNavUpdate = {};
    }
    prevBWidth = bWidth;
  }

  const readMessage = async (e) => {
    const key = e.detail.key;

    DisplayLoading();
    await update(ref(db, `users/${$user.uid}/inbox/${key}`), { '/read': true });
    CloseLoading();
    DisplayDialogue({
      header: $messages[key].title,
      headerStyles: 'text-center text-3xl mb-4',
      onSubmit: CloseDialogue,
      submitBtnText: 'Close',
      fields: [
        // @ts-ignore
        {
          type: 'paragraph',
          body: $messages[key].content ?? $messages[key].description,
        },
      ],
    });
  };

  const markAsRead = async (e) => {
    await update(ref(db, `users/${$user.uid}/inbox/${e.detail.key}`), {
      '/read': true,
    });
  };

  const markAsUnread = async (e) => {
    await update(ref(db, `users/${$user.uid}/inbox/${e.detail.key}`), {
      '/read': false,
    });
  };

  const deleteMessageDialogue = (e) => {
    DisplayDialogue({
      header: 'Are you sure you want to delete this message?',
      headerStyles: 'text-xl text-center mb-1',
      onSubmit: () => {
        CloseDialogue();
        deleteMessage(e.detail.key);
      },
      submitBtnText: 'Confirm',
      buttons: [
        {
          title: 'Cancel',
          onClick: () => CloseDialogue(),
          stylingClasses: 'bg-transparent',
        },
      ],
    });
  };

  const deleteMessage = async (id) => {
    DisplayLoading();
    await remove(ref(db, `users/${$user.uid}/inbox/${id}`));
    CloseLoading();
  };
</script>

<svelte:window on:resize={() => (bWidth = window.innerWidth)} />

{#if bWidth < 640}
  <button
    class="navBtn bg-black fixed z-20 text-white box-content border top-3 left-3 px-2 py-0.5 rounded-md text-xl
    {isDisplayingNavbar ? 'border-gray-300' : 'border-black'}"
    on:click={() => (isDisplayingNavbar = !isDisplayingNavbar)}
    bind:offsetHeight={btnHeight}
    title="{isDisplayingNavbar ? 'Hide' : 'Show'} Navigation Bar"
  >
    {@html icon(faBars).html}
  </button>
{/if}

{#if !$page.path.match(/(login)|(signup)$/gim)}
  {#key callNavUpdate}
    {#if bWidth > 640 || isDisplayingNavbar}
      <nav
        class="p-3 bg-black fixed sm:sticky text-white z-10 top-0 bottom-0 sm:bottom-auto sm:right-0 sm:left-0 text-xl sm:text-base"
        transition:fly|local={{
          x: bWidth < 640 ? -75 : 0,
          y: bWidth > 640 ? -75 : 0,
          duration: 750,
        }}
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center"
          style="margin-top: {bWidth < 640 ? btnHeight + 10 : 0}px;
          height: calc(100% - {bWidth < 640 ? btnHeight + 10 : 0}px)"
        >
          {#if $user}
            <div class="flex items-center {bWidth < 640 && 'flex flex-col justify-center'}">
              <button
                title="User profile"
                class="px-2 py-1"
                on:click={() => goto(`${base}user/${$user.uid}`)}
              >
                {#if $imageCache}
                  <img
                    style="height: 20px;"
                    class="profileImg rounded-full"
                    src={$imageCache ?? '/resources/images/user.svg'}
                    alt=""
                  />
                {:else}
                  {@html icon(faUser).html}
                {/if}
              </button>
              <div class="relative inline-block">
                <button
                  title="Inbox {hasUnread ? '• Unread Messages' : ''}"
                  class="px-2 py-1 {hasUnread ? 'unreadMessages' : ''}"
                  style="z-index: 11;"
                  on:click={() => (isDisplayingMessages = !isDisplayingMessages)}
                >
                  {@html icon(faEnvelope).html}
                </button>
                {#if isDisplayingMessages}
                  <div
                    class="inbox mt-1 w-80 z-10 absolute top-6 ml-2 sm:ml-1.5"
                    in:fly|local={{ y: 20, duration: 500 }}
                    out:fly|local={{ y: 20, duration: 500, delay: 750 }}
                  >
                    <div class="text-black bg-gray-200 border-t-4 border-b-4 border-gray-400">
                      <div
                        class="messageContainer"
                        style="max-height: 300px; overflow-y: scroll;"
                        out:slide={{ duration: 750 }}
                      >
                        {#if Object.keys($messages ?? {})?.length > 0}
                          {#each Object.entries($messages) as [key, val], i}
                            <Message
                              {...val}
                              {key}
                              index={i}
                              on:readMessage={readMessage}
                              on:markAsRead={markAsRead}
                              on:markAsUnread={markAsUnread}
                              on:deleteMessage={deleteMessageDialogue}
                            />
                          {/each}
                        {:else}
                          <div in:slide={{ duration: 500, delay: 350 }} out:fade>
                            <h2 class="py-4 text-center">Your inbox is empty!</h2>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <span />
          {/if}
          <div
            class="flex flex-col sm:flex-row items-center gap-5 sm:gap-10 absolute top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 "
          >
            {#if $page.path == '/'}
              {#if $user}
                <a href="#projects" title="Projects">{@html icon(faTasks).html}</a>
              {/if}
              <a href="#about" title="About">{@html icon(faBook).html}</a>
              <a href="#roadmap" title="Roadmap">{@html icon(faRoute).html}</a>
            {:else}
              <!--The style tag is magic numbers that make the buttons even. No I don't know either.-->
              <button class="text-xl" title="Home" on:click={() => goto(base)}>
                {@html icon(faHome).html}
              </button>
              {#if $user?.uid == $project?.details?.owner && $user?.uid != null && $page.path.match(/^\/?project\/.+$/)}
                <button
                  class="text-xl"
                  title="Project Settings"
                  on:click={() => ($isDisplayingProjectSettings = !$isDisplayingProjectSettings)}
                >
                  {@html icon(faCog).html}
                </button>
              {/if}
            {/if}
          </div>
          {#if !$user}
            <button
              on:click={() => (window.location.pathname = `${base}auth/login`)}
              class="bg-green-500 rounded-sm px-2 py-1 text-white hover:bg-green-800 transition-colors"
              title="Sign in"
            >
              {@html icon(faSignInAlt).html}
            </button>
          {/if}
        </div>
      </nav>
    {/if}
  {/key}
{/if}

<style global>
  .inbox::before {
    content: '\25B2';
    display: block;
    line-height: 0.8 !important;
    @apply text-2xl text-gray-400;
  }

  .inbox > div > div div:first-of-type .message {
    @apply border-t-0;
  }

  .inbox > div > div div:last-of-type .message {
    @apply border-b-0;
  }

  .inbox > div > div div:nth-of-type(odd) .message {
    @apply border-0;
  }

  /* width */
  .messageContainer::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  .messageContainer::-webkit-scrollbar-track {
    background: rgb(201, 200, 200);
  }

  /* Handle */
  .messageContainer::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  .messageContainer::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .unreadMessages {
    position: relative;
  }
  .unreadMessages::before {
    content: '';
    position: absolute;
    background-color: red;
    padding: 0.215rem;
    border-radius: 50%;
    right: 15%;
    top: 20%;
  }

  .navBtn,
  nav,
  nav * {
    -webkit-tap-highlight-color: transparent;
  }
</style>
