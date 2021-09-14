<script lang="ts">
  import { user } from '@ts/stores';
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
    uploadString,
    updateProfile,
    set,
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
  } from '@ts/FirebaseImports';
  import { CloseLoading, DisplayLoading, DisplayToast } from '@ts/utils';
  import { goto } from '$app/navigation';
  import { base } from '@ts/stores';
  import { Stretch } from 'svelte-loading-spinners';

  let section: 'general' | 'security' = 'general';

  const uploadProfilePic = async (e) => {
    const file: File = e.target.files[0];
    DisplayLoading();

    const piexif = await import('piexifjs');

    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      let image = new Image();

      image.onload = () => {
        // Clamp canvas width and height to be smaller than 512px.
        canvas.width = Math.min(Math.max(image.width, 1), 512);
        canvas.height = Math.min(Math.max(image.height, 1), 512);

        let ctx = canvas.getContext('2d');

        // Fill canvas with solid color
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Check image width & height for the proper scaling
        if (image.width > 512 && image.width > image.height) {
          ctx.drawImage(
            image,
            0,
            // Center the image
            (canvas.height - image.height / (image.width / 512)) / 2,
            512,
            // Scale the image down properly
            image.height / (image.width / 512),
          );
        } else if (image.height > 512 && image.height > image.width) {
          ctx.drawImage(
            image,
            // Center the image
            (canvas.width - image.width / (image.height / 512)) / 2,
            0,
            // Scale the image down properly
            image.width / (image.height / 512),
            512,
          );
          // If height and width are equal but are bigger than 512px just scale both axes equally
        } else if (image.width > 512 && image.height > 512) {
          ctx.drawImage(image, 0, 0, 512, 512);
          // If image isn't bigger on any axis.
        } else {
          ctx.drawImage(image, 0, 0);
        }

        const resultImg: string = piexif.remove(canvas.toDataURL('image/jpeg'));
        const imageFileSize =
          resultImg.length * 0.75 -
          (resultImg.endsWith('==') ? 2 : resultImg.endsWith('=') ? 1 : 0);

        // Ensure that image size is smaller than 5.5MB
        if (imageFileSize > 1024 * 1024 * 512 * 5) {
          DisplayToast({
            title: 'The chosen image must be less than 5 MB in size!',
            duration: 5000,
          });
          return;
        } else {
          uploadString(
            storageRef(getStorage(), `${$user.uid}/profilePicture`),
            resultImg,
            'data_url',
          ).then(() => {
            CloseLoading();
            location.reload();
          });
        }
      };

      // @ts-ignore
      // Load image
      image.src = fileReader.result;
    });

    // read submitted file as base64
    fileReader.readAsDataURL(file);
  };

  let tempEmail;
  let tempUsername;

  let unsub = user.subscribe((u) => {
    if (u) {
      tempEmail = u?.email;
      tempUsername = u?.displayName;
    }
  });

  $: unsub && tempUsername && unsub();

  let imageInput;

  const changeEmail = (e) => {
    if ($user.emailVerified) return;
    const newEmail = e.target[0].value;

    updateEmail($user, newEmail)
      .then(() => DisplayToast({ title: 'Email Updated Successfully!', duration: 5000 }))
      .catch(() => DisplayToast({ title: 'Something went wrong!', duration: 5000 }));
  };

  let triggerUpdate = {};
  const updateUsername = async (e) => {
    const oldUsername = $user.displayName;
    const newUsername = e.target[0].value;

    try {
      await updateProfile($user, { displayName: newUsername });
      await set(ref(getDatabase(), `users/${$user.uid}/displayName`), newUsername);
      DisplayToast({ title: 'Username Updated Successfully!', duration: 5000 });
      triggerUpdate = {};
    } catch {
      await updateProfile($user, { displayName: oldUsername });
      await set(ref(getDatabase(), `users/${$user.uid}/displayName`), oldUsername);
      DisplayToast({ title: 'Something went wrong!', duration: 5000 });
    }
  };

  let currPass;
  let newPass;
  let confirmNewPass;
  let isChangingPass = false;

  const updatePass = async () => {
    isChangingPass = true;
    try {
      if (newPass != confirmNewPass) throw new Error('Passwords do not match!');
      const cred = EmailAuthProvider.credential($user.email, currPass);
      await reauthenticateWithCredential($user, cred);
      await updatePassword($user, newPass);
      DisplayToast({ title: 'Password updated successfully!' });

      currPass = null;
      newPass = null;
      confirmNewPass = null;
    } catch (e) {
      switch (e.code?.substring(5)) {
        case 'wrong-password':
          DisplayToast({ title: 'Incorrect Password Entered!' });
          break;
        case 'weak-password':
          DisplayToast({ title: 'New password is too weak!' });
          break;
        default:
          DisplayToast({ title: e.message });
          break;
      }
    } finally {
      isChangingPass = false;
    }
  };
</script>

<div
  class="flex ml-0 mt-10 flex-col items-center md:items-start gap-10 md:gap-20 md:flex-row md:ml-10"
>
  {#if $user?.uid == $page.params.id}
    <div class="menu w-fit">
      <ul>
        <li class="text-xl pr-10">User Account</li>
        <li class="hover:cursor-pointer">
          <button on:click={() => (section = 'general')}>General & Details</button>
        </li>
        <li class="hover:cursor-pointer">
          <button on:click={() => (section = 'security')}> Security </button>
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
  {#if section == 'general' || $user?.uid != $page.params.id}
    <div class="flex flex-col gap-32 flex-grow">
      <div class="flex gap-5 flex-col md:flex-row items-center md:items-start">
        <div
          on:click={() => {
            if ($user?.uid == $page.params.id) imageInput.click();
          }}
          class="{$user?.uid == $page.params.id && 'hover:cursor-pointer imageTooltip'} w-fit"
        >
          {#await getDownloadURL(storageRef(getStorage(), `${$page.params.id}/profilePicture`))}
            <img class="profileImg" src="/user.svg" alt="" />
          {:then url}
            <img
              style="background-image: url({url}); background-color: white;"
              class="profileImg"
              alt=""
            />
          {:catch}
            <img class="profileImg" src="/user.svg" alt="" />
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
          {#key triggerUpdate}
            {#await get(ref(getDatabase(), `users/${$page.params.id}/displayName`)) then snapshot}
              {#await snapshot.val() then name}
                <h3 class="text-xl">{name ?? "This user doesn't exist!"}</h3>
                {#if name}
                  <h4
                    on:click={() => {
                      navigator.clipboard
                        .writeText($page.params.id)
                        .then(() => DisplayToast({ title: 'Copied To Clipboard!' }))
                        .catch(() => DisplayToast({ title: 'Failed to copy.' }));
                    }}
                    class="text-gray-400 hover:cursor-pointer copyToClipboard"
                  >
                    {$page.params.id}
                  </h4>
                {/if}
              {/await}
            {/await}
          {/key}
        </div>
      </div>
      {#if $user?.uid == $page.params.id}
        <div>
          <h3 class="text-2xl mb-10">Details:</h3>
          <div class="flex flex-col gap-10 md:ml-10">
            <form on:submit|preventDefault={updateUsername}>
              <label for="username">Username:</label><br />
              <input
                class="border border-black rounded-sm pl-1 outline-none font-mono w-full md:w-1/2 mt-1 mb-2"
                type="text"
                name="username"
                id="username"
                bind:value={tempUsername}
              />
              {#if tempUsername != $user.displayName}
                <br />
                <input
                  class="border border-black rounded-sm pl-1 outline-none w-full md:w-36 hover:cursor-pointer bg-transparent hover:bg-black hover:text-white transition-colors"
                  type="submit"
                  value="Update"
                />
              {/if}
            </form>
            <div>
              <h4>
                Email Address status: <span
                  class={$user?.emailVerified ? 'text-green-500' : 'text-red-700'}
                  >{$user?.emailVerified ? 'verified' : 'not verified'}</span
                >
              </h4>
              {#if !$user?.emailVerified}
                <form on:submit|preventDefault={changeEmail}>
                  <label for="email">E-Mail:</label><br />
                  <input
                    class="border border-black rounded-sm pl-1 outline-none font-mono w-full md:w-1/2 mt-1 mb-2"
                    type="email"
                    name="email"
                    id="email"
                    bind:value={tempEmail}
                  />
                  {#if tempEmail != $user.email}
                    <br />
                    <input
                      class="border border-black rounded-sm pl-1 outline-none w-full md:w-36 hover:cursor-pointer bg-transparent hover:bg-black hover:text-white transition-colors"
                      type="submit"
                      value="Save"
                    />
                  {/if}
                </form>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {:else if section == 'security' && $user?.uid == $page.params.id}
    <div>
      <h3 class="text-2xl mb-10">Account Security:</h3>
      {#if isChangingPass}
        <div class="w-fit m-auto">
          <Stretch color="#000000" size="40" />
        </div>
      {:else}
        <div>
          <h4 class="text-xl mb-9">Update Password:</h4>
          <form class="md:ml-10" on:submit|preventDefault={updatePass}>
            <div class="flex flex-col gap-3">
              <div>
                <label for="username">Current Password:</label><br />
                <input
                  class="border border-black rounded-sm pl-1 outline-none font-mono w-full md:w-52 mt-1 mb-2"
                  type="password"
                  name="currPass"
                  id="currPass"
                  bind:value={currPass}
                />
              </div>
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
            </div>
            {#if currPass && newPass && confirmNewPass}
              <input
                class="border border-black rounded-sm pl-1 outline-none w-full md:w-52 hover:cursor-pointer bg-transparent hover:bg-black hover:text-white transition-colors"
                type="submit"
                value="Update Password"
              />
            {/if}
          </form>
        </div>
      {/if}
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

  .profileImg {
    @apply w-48 h-48 rounded-full bg-no-repeat bg-contain border border-black bg-bottom;
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
