<script context="module">
	export const prerender = true;
</script>

<script>
	import { Circle } from 'svelte-loading-spinners';
	import {
		browserLocalPersistence,
		getAuth,
		signInWithEmailAndPassword,
		setPersistence
	} from 'firebase/auth';

	let isSigningIn = false;
	const signIn = (e) => {
		e.preventDefault();

		isSigningIn = true;

		const auth = getAuth();
		setPersistence(auth, browserLocalPersistence).then(() => {
			signInWithEmailAndPassword(auth, e.target[0].value, e.target[1].value)
				.then((user) => {
					window.location.pathname = '/';
				})
				.catch((e) => {
					// @ts-ignore
					switch (e.code) {
						case 'auth/user-not-found':
							alert("This user doesn't exist!");
							break;
						default:
							alert(e.message);
							break;
					}
					isSigningIn = false;
				});
		});
	};
</script>

<div class="bg-main w-full h-full flex items-center justify-around">
	<div class="bg-white px-4 py-10 w-max flex flex-col rounded-md shadow-2xl">
		<h1 class="text-center mb-auto font-light text-4xl">D-Bugger | Log-in</h1>

		<form on:submit={signIn} class="flex flex-col gap-5 mx-2 justify-center h-full pt-10">
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
					Don't have an account? <a href="/signup" class="wavy-underline"
						><strong>Sign up</strong></a
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
