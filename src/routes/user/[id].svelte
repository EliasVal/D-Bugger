<script lang="ts">
  import { user as userWritable } from '@ts/stores';
  import { page } from '$app/stores';
  import { getAuth, get, ref, getDatabase } from '@ts/FirebaseImports';
  import { DisplayToast } from '@ts/utils';

  let section: 'general' | 'settings' = 'general';

  let user;
  $: if ($userWritable != 'unknown' && $userWritable) user = getAuth().currentUser;
</script>

<div class="flex ml-10 mt-10 gap-20">
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
      </ul>
    </div>
  {/if}
  {#if section == 'general' || user?.uid != $page.params.id}
    <div class="flex gap-5">
      {#if user?.uid == $page.params.id}
        <img
          class="profileImg w-48 rounded-full"
          src={user.profilePictureURL ?? '/static/user.svg'}
          alt=""
        />
      {:else}
        {#await get(ref(getDatabase(), `users/${$page.params.id}/profilePictureURL`))}
          <img class="w-48 rounded-full" src="/static/user.svg" alt="" />
        {:then snapshot}
          {#await snapshot.val()}
            <img class="w-48 rounded-full" src="/static/user.svg" alt="" />
          {:then img}
            <img class="profileImg w-48 rounded-full" src={img ?? '/static/user.svg'} alt="" />
          {/await}
        {/await}
      {/if}
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
              <h4
                on:click={() => {
                  navigator.clipboard
                    .writeText($page.params.id)
                    .then(() => DisplayToast({ title: 'Copied To Clipboard!', duration: 4000 }))
                    .catch(() => DisplayToast({ title: 'Failed to copy.', duration: 4000 }));
                }}
                class="text-gray-400 hover:cursor-pointer copyToClipboard"
              >
                {name ? $page.params.id : ''}
              </h4>
            {/await}
          {/await}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .menu ul li:not(:first-child) {
    @apply text-blue-500 pl-1 py-1;
  }

  .menu ul li {
    @apply border-b border-gray-600;
  }

  .profileImg {
    background: url(/static/user.svg) no-repeat scroll 0 0;
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
</style>
