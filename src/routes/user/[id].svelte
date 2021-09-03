<script lang="ts">
  import { user as userWritable } from '@ts/stores';
  import { page } from '$app/stores';
  import {
    getAuth,
    get,
    ref,
    getDatabase,
    signOut,
    getDownloadURL,
    getStorage,
    storageRef,
    uploadBytes,
  } from '@ts/FirebaseImports';
  import { DisplayToast } from '@ts/utils';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let section: 'general' | 'settings' = 'general';

  let user;
  $: if ($userWritable != 'unknown' && $userWritable) user = getAuth().currentUser;

  const uploadProfilePic = (e) => {
    uploadBytes(
      storageRef(getStorage(), `${user.uid}/profilePicture`),
      e.target.files[0],
    ).then(() => console.log('DONE'));
  };

  let imageInput;
</script>

<div class="flex ml-10 mt-10 flex-col items-center gap-20 sm:flex-row">
  {#if user?.uid == $page.params.id}
    <div class="menu w-fit pr-5">
      <ul>
        <li class="text-xl pr-10">User Account</li>
        <li class="hover:cursor-pointer">
          <button>General & Details</button>
        </li>
        <li class="hover:cursor-pointer">
          <button>Security</button>
        </li>
        <li class="hover:cursor-pointer text-red-600 pl-1 py-1">
          <button
            on:click|once={() => {
              signOut(getAuth());
              goto(base);
            }}
          >
            Log out
          </button>
        </li>
      </ul>
    </div>
  {/if}
  {#if section == 'general' || user?.uid != $page.params.id}
    <div class="flex gap-5 flex-col md:flex-row">
      <div
        on:click={() => {
          if (user?.uid == $page.params.id) imageInput.click();
        }}
        class="{user?.uid == $page.params.id && 'hover:cursor-pointer imageTooltip'} w-fit"
      >
        {#await getDownloadURL(storageRef(getStorage(), `${$page.params.id}/profilePicture`))}
          <img class="w-48 rounded-full" src="/D-Bugger/user.svg" alt="" />
        {:then url}
          <img
            style="background-image: url({url ?? '/D-Bugger/user.svg'});"
            class="w-48 h-48 rounded-full bg-no-repeat bg-contain border border-black bg-bottom"
            src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif"
            alt=""
          />
        {:catch}
          <img class="w-48 rounded-full" src="/D-Bugger/user.svg" alt="" />
        {/await}
        <input
          type="file"
          name="image"
          id="imgInput"
          on:change={uploadProfilePic}
          bind:this={imageInput}
          accept="image/png, image/svg+xml, image/jpeg"
          class="hidden"
        />
      </div>
      <div>
        {#if user?.uid == $page.params.id}
          <h3 class="text-xl">{user.displayName}</h3>
          <h4
            on:click={() => {
              navigator.clipboard
                .writeText($page.params.id)
                .then(() => DisplayToast({ title: 'Copied To Clipboard!', duration: 4000 }))
                .catch(() => DisplayToast({ title: 'Failed to copy.', duration: 4000 }));
            }}
            class="text-gray-400 hover:cursor-pointer copyToClipboard"
          >
            {user.uid}
          </h4>
        {:else}
          {#await get(ref(getDatabase(), `users/${$page.params.id}/displayName`)) then snapshot}
            {#await snapshot.val() then name}
              <h3 class="text-xl">{name ?? "This user doesn't exist!"}</h3>
              {#if name}
                <h4
                  on:click={() => {
                    navigator.clipboard
                      .writeText($page.params.id)
                      .then(() => DisplayToast({ title: 'Copied To Clipboard!', duration: 4000 }))
                      .catch(() => DisplayToast({ title: 'Failed to copy.', duration: 4000 }));
                  }}
                  class="text-gray-400 hover:cursor-pointer copyToClipboard"
                >
                  {$page.params.id}
                </h4>
              {/if}
            {/await}
          {/await}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .menu ul li:not(:first-child):not(:last-child) {
    @apply text-blue-500;
  }

  .menu ul li:not(:last-child) {
    @apply pl-1 py-1;
  }

  .menu ul li {
    @apply border-b border-gray-600;
  }

  .menu ul li button {
    width: 100%;
    text-align: left;
  }

  .copyToClipboard {
    position: relative;
  }

  .copyToClipboard:hover::before {
    opacity: 1;
  }

  .copyToClipboard::before {
    opacity: 0;
    content: 'Copy to clipboard';
    position: absolute;
    top: -160%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    border-radius: 0.175rem;
    color: white;
    background-color: black;
    padding: 0.5rem;

    transition: 0.35s;
  }

  .imageTooltip {
    position: relative;
  }

  .imageTooltip:hover::after {
    opacity: 1;
  }

  .imageTooltip::after {
    opacity: 0;
    content: 'Change Profile Picture';
    position: absolute;
    bottom: -25%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    border-radius: 0.175rem;
    color: white;
    background-color: black;
    padding: 0.5rem;

    transition: 0.35s;
  }
</style>
