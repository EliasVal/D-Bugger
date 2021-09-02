<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { icon } from '@fortawesome/fontawesome-svg-core';
  import {
    faBars,
    faBook,
    faCog,
    faEnvelope,
    faHome,
    faRoute,
    faSignInAlt,
    faSignOutAlt,
    faTasks,
    faUser,
  } from '@fortawesome/free-solid-svg-icons';

  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';

  import { getAuth, getDatabase, onValue, ref, signOut, update, remove } from '@ts/FirebaseImports';
  import { isDisplayingProjectSettings, project, user } from '@ts/stores';
  import {
    DisplayDialogue,
    CloseDialogue,
    DisplayLoading,
    CloseLoading,
    DisplayToast,
  } from '@ts/utils';

  import Message from './Message.svelte';

  const auth = getAuth();
  const SignOut = async () => {
    await signOut(auth);
    if ($page.path != '/D-Bugger') goto('/D-Bugger');
  };

  let bWidth;
  let isDisplayingNavbar = true;
  let isDisplayingMessages = false;
  let hasUnread = false;
  let btnHeight;

  $: if (bWidth > 640) isDisplayingNavbar = true;

  const db = getDatabase();
  const messages = writable();
  onMount(() => {
    user.subscribe((u) => {
      if (u && u != 'unknown') {
        // @ts-ignore
        onValue(ref(db, `users/${u.uid}/inbox`), async (snapshot) => {
          messages.set(await snapshot.val());
        });
      }
    });
  });

  $: {
    if ($messages) {
      let found = false;
      for (let val of Object.values($messages)) {
        if (!val.read) {
          found = true;
          hasUnread = true;
          break;
        }
      }
      if (!found) hasUnread = false;
    } else hasUnread = false;
  }

  const readMessage = async (e) => {
    const key = e.detail.key;

    DisplayLoading();
    await update(ref(db, `users/${auth.currentUser.uid}/inbox/${key}`), { '/read': true });
    CloseLoading();
    DisplayDialogue({
      header: $messages[key].title,
      headerStyles: 'text-center text-3xl mb-4',
      onSubmit: () => CloseDialogue(),
      submitBtnText: 'Close',
      fields: [
        // @ts-ignore
        {
          type: 'paragraph',
          body: $messages[key].content,
        },
      ],
    });
  };

  const markAsRead = async (e) => {
    await update(ref(db, `users/${auth.currentUser.uid}/inbox/${e.detail.key}`), {
      '/read': true,
    });
  };

  const markAsUnread = async (e) => {
    await update(ref(db, `users/${auth.currentUser.uid}/inbox/${e.detail.key}`), {
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
    await remove(ref(db, `users/${auth.currentUser.uid}/inbox/${id}`));
    CloseLoading();
  };
</script>

<svelte:window bind:innerWidth={bWidth} />

{#if bWidth < 640}
  <button
    class="navBtn bg-black fixed z-20 text-white border top-3 left-3 border-gray-300 px-2 py-0.5 rounded-md text-xl"
    on:click={() => (isDisplayingNavbar = !isDisplayingNavbar)}
    bind:offsetHeight={btnHeight}
  >
    {@html icon(faBars).html}
  </button>
{/if}
<svelte:head>
  {#if bWidth < 640}
    <style>
      .inbox::before {
        margin: 3px 0 0 2px;
      }
    </style>
  {/if}
</svelte:head>

{#if !$page.path.match(/(login)|(signup)/gim)}
  {#if bWidth > 640 || isDisplayingNavbar}
    <nav
      class="p-3 bg-black text-white fixed z-10 top-0 bottom-0 sm:bottom-auto sm:right-0 sm:left-0 text-xl sm:text-base"
      transition:fly={{ x: bWidth < 640 && -75, y: bWidth > 640 && -75, duration: 1000 }}
    >
      <div
        class="flex flex-col sm:flex-row justify-between items-center"
        style="margin-top: {bWidth < 640 ? btnHeight + 10 : 0}px;
			height: calc(100% - {bWidth < 640 ? btnHeight + 10 : 0}px)"
      >
        {#if $user}
          <div class={bWidth < 640 && 'flex flex-col items-center justify-center'}>
            <button
              title="User profile"
              class="px-2 py-1"
              on:click={() => {
                DisplayToast({
                  title: 'Expand this message to see your ID.',
                  desc: `User Profiles are currently unavailable.<br />Your ID: <u>${auth.currentUser.uid}</u>`,
                  duration: 10000,
                });
              }}
            >
              {@html icon(faUser).html}
            </button>
            <div class="relative inline-block">
              <button
                title="Inbox {hasUnread ? '• Unread Messages' : ''}"
                class="px-2 py-1 {hasUnread ? 'unreadMessages' : ''}"
                on:click={() => (isDisplayingMessages = !isDisplayingMessages)}
              >
                {@html icon(faEnvelope).html}
              </button>
              {#if isDisplayingMessages}
                <div class="inbox w-80 absolute top-6" transition:fly={{ y: 20, duration: 750 }}>
                  <div
                    class="text-black bg-gray-200 border-t-4 border-b-4
                    {bWidth < 640 && 'border-r-4 border-l-4'} border-gray-400"
                  >
                    {#if $messages}
                      {#each Object.entries($messages) as [key, val]}
                        <Message
                          {...val}
                          {key}
                          hasContent={'content' in val}
                          on:readMessage={readMessage}
                          on:markAsRead={markAsRead}
                          on:markAsUnread={markAsUnread}
                          on:deleteMessage={deleteMessageDialogue}
                        />
                      {/each}
                    {:else}
                      <div>
                        <h2 class="py-4 text-center">Your inbox is empty!</h2>
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {:else}
          <span />
        {/if}
        <div
          class="flex flex-col sm:flex-row items-center gap-5
          {$page.path == '/' && 'sm:gap-10'}
          absolute top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 "
        >
          {#if $page.path == '/'}
            <a href="#projects" title="Projects">{@html icon(faTasks).html}</a>
            <a href="#about" title="About">{@html icon(faBook).html}</a>
            <a href="#roadmap" title="Roadmap">{@html icon(faRoute).html}</a>
          {:else}
            <!--The style tag is magic numbers that make the buttons even. No I don't know either.-->
            <button
              class="text-xl"
              style="padding: 0 0.9375rem; max-width: 52px;"
              title="Home"
              on:click={() => goto('/D-Bugger')}
              in:fly={{ x: bWidth > 640 && 20, duration: bWidth > 640 && 1000, delay: 750 }}
            >
              {@html icon(faHome).html}
            </button>
            {#if auth.currentUser?.uid == $project?.details.owner && auth.currentUser?.uid != null}
              <span
                class="border border-white absolute left-1/2 top-0 bottom-0 hidden sm:block"
                in:fade={{ delay: 250 }}
              />
              <button
                class="px-4 text-xl"
                title="Project Settings"
                on:click={() => ($isDisplayingProjectSettings = !$isDisplayingProjectSettings)}
                in:fly={{ x: bWidth > 640 && -20, duration: bWidth > 640 && 1000, delay: 750 }}
              >
                {@html icon(faCog).html}
              </button>
            {/if}
          {/if}
        </div>
        {#if $user}
          <button
            on:click={SignOut}
            class="bg-red-600 rounded-sm px-2 py-1 text-white hover:bg-red-800 transition-colors"
            title="Sign out"
          >
            {@html icon(faSignOutAlt).html}
          </button>
        {:else}
          <button
            on:click={() => goto('/D-Bugger/login')}
            class="bg-green-500 rounded-sm px-2 py-1 text-white hover:bg-green-800 transition-colors"
            title="Sign in"
          >
            {@html icon(faSignInAlt).html}
          </button>
        {/if}
      </div>
    </nav>
  {/if}
{/if}

<style global>
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
  .inbox::before {
    content: '⯅';
    display: block;
    line-height: 0.6 !important;
    transform: translateY(3px);
    @apply text-4xl text-gray-400;
    pointer-events: none;
  }

  .message {
    @apply border-t-2 border-b-2 border-gray-300 p-2 py-5;
  }

  .message-moreContent::after {
    content: 'Read more';
    position: absolute;
    @apply text-xs text-gray-400 right-2 bottom-1;
  }

  .message-unread h2::after {
    content: '';
    background-color: red;
    padding: 0.215rem;
    border-radius: 50%;
    display: inline-block;
    margin-bottom: 0.125rem;
    margin-left: 0.275rem;
  }
</style>
