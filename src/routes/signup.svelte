<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { Circle } from 'svelte-loading-spinners';
	import {
		getAuth,
		setPersistence,
		browserLocalPersistence,
		createUserWithEmailAndPassword,
		updateProfile,
		sendEmailVerification
	} from 'firebase/auth';

	import { getDatabase, set, ref } from 'firebase/database';

	let isSigningUp = false;
	const signIn = (e: Event) => {
		e.preventDefault();

		isSigningUp = true;

		if (!e.target[0].value || e.target[0].value.length < 3) {
			alert('You must enter a username that is atleast 3 characters long!');
			isSigningUp = false;
			return;
		}

		const auth = getAuth();
		setPersistence(auth, browserLocalPersistence).then(() => {
			createUserWithEmailAndPassword(auth, e.target[1].value, e.target[2].value)
				.then(async (user) => {
					// Set username in user's profile
					await updateProfile(auth.currentUser, {
						displayName: e.target[0].value
					});
					// Set username in user's DB
					await set(ref(getDatabase(), `users/${auth.currentUser.uid}`), {
						displayName: e.target[0].value
					});

					await sendEmailVerification(auth.currentUser);

					// Redirect to index
					window.location.pathname = '/';
				})
				.catch((e: Error) => {
					// @ts-ignore
					switch (e.code) {
						case 'auth/user-not-found':
							alert("This user doesn't exist!");
							break;
						default:
							alert(e.message);
							break;
					}
					isSigningUp = false;
				});
		});
	};
</script>

<div class="bg-main w-full h-full flex items-center justify-around">
	<div class="bg-white px-4 py-10 w-max flex flex-col rounded-md shadow-2xl">
		<h4 class="text-center mb-auto font-light text-4xl">D-Bugger | Sign-up</h4>
		<form on:submit={signIn} class="flex flex-col gap-5 mx-2 justify-center h-full pt-10">
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
					Already have an account? <a href="/login" class="wavy-underline"
						><strong>Log-in</strong></a
					>
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
