<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { bug } from '/src/ts/stores';
	import { fade, fly, slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let name: string;
	let platform: string;
	let w: number;

	const addAssigned = () => {
		if ($bug?.details.assignedTo?.includes(name)) {
			alert('This person is already on the list!');
			name = undefined;
			return;
		} else if (name == undefined || !name.replace(/\s/g, '').length) {
			alert('This field cannot be empty!');
			name = undefined;
			return;
		}

		if ($bug?.details.assignedTo) {
			$bug.details.assignedTo = [...$bug.details.assignedTo, name];
		} else {
			$bug.details.assignedTo = [name];
		}
		name = undefined;
	};

	const removeAssigned = (aName) => {
		$bug.details.assignedTo = $bug.details.assignedTo.filter((n) => n != aName);
	};

	const addPlatform = () => {
		if ($bug?.details.platforms?.includes(platform)) {
			alert('This platform is already on the list!');
			platform = undefined;
			return;
		} else if (platform == undefined || !platform.replace(/\s/g, '').length) {
			alert('This field cannot be empty!');
			platform = undefined;
			return;
		}

		if ($bug.details.platforms) {
			$bug.details.platforms = [...$bug.details.platforms, platform];
		} else {
			$bug.details.platforms = [platform];
		}

		platform = undefined;
	};

	const removePlatform = (pName) => {
		$bug.details.platforms = $bug.details.platforms.filter((n) => n != pName);
	};
</script>

<svelte:window bind:innerWidth={w} />
<div>
	<h1 class="underline text-2xl text-center mb-5">Bug Details:</h1>
	<form
		class="flex flex-col gap-5 items-center"
		on:submit|preventDefault={() => {
			dispatch('saveBugChanges');
		}}
	>
		<div>
			<label for="title">Title:</label><br />
			<input
				class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none"
				id="title"
				type="text"
				bind:value={$bug.title}
			/>
		</div>
		<!--Bug Severity-->
		<div>
			<label for="severity">Severity:</label><br />
			<select
				class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none hover:cursor-pointer w-full"
				id="severety"
				bind:value={$bug.details.severity}
			>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
				<option value="severe">Severe</option>
			</select>
		</div>
		<!--Bug Platforms-->
		<div>
			<label for="platform">Platform(s):</label><br />
			<div class="flex flex-col">
				<ul class="mt-2 mb-1" style="min-height: 40px">
					{#if $bug.details.platforms?.length > 0}
						{#each $bug.details.platforms as platform}
							<li class="bg-black text-white px-2 py-1 rounded-md my-1">
								<p class="text-left inline">{platform}</p>
								<button
									on:click={() => removePlatform(platform)}
									class="float-right font-mono text-gray-400 hover:text-red-500 h-full">x</button
								>
							</li>
						{/each}
					{:else}
						<li class="bg-black text-white px-2 py-1 rounded-md my-1">
							<p>Any</p>
						</li>
					{/if}
				</ul>
				<form on:submit|preventDefault={() => addPlatform()}>
					<input
						class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none"
						type="text"
						placeholder="Enter platform..."
						id="assignedTo"
						bind:value={platform}
					/>
					<input
						type="submit"
						value="Add"
						class="border-2 border-black px-2 py-0.5 rounded-sm bg-transparent hover:bg-black hover:text-white transition-colors hover:cursor-pointer w-full mt-1"
					/>
				</form>
			</div>
		</div>
		<!--Assigned To-->
		<div>
			<label for="assignedTo">Assigned To:</label><br />
			<div class="flex flex-col">
				<ul class="mt-2 mb-1" style="min-height: 40px">
					{#if $bug.details.assignedTo?.length > 0}
						{#each $bug.details.assignedTo as person}
							<li class="bg-black text-white px-2 py-1 rounded-md my-1">
								<p class="text-left inline">{person}</p>
								<button
									on:click={() => removeAssigned(person)}
									class="float-right font-mono text-gray-400 hover:text-red-500">x</button
								>
							</li>
						{/each}
					{:else}
						<li class="bg-black text-white px-2 py-1 rounded-md my-1">
							<p>Anyone/No-one</p>
						</li>
					{/if}
				</ul>
				<form on:submit|preventDefault={() => addAssigned()}>
					<input
						class="border rounded-sm border-black px-1 py-0.5 font-mono outline-none"
						type="text"
						placeholder="Enter name..."
						id="assignedTo"
						bind:value={name}
					/>
					<input
						type="submit"
						value="Add"
						class="border-2 border-black px-2 py-0.5 rounded-sm bg-transparent hover:bg-black hover:text-white transition-colors hover:cursor-pointer w-full mt-1"
					/>
				</form>
			</div>
		</div>
		<!--Bug Status-->
		<div>
			<label for="status">Status:</label><br />
			<select
				class="border rounded-sm border-black px-1 py-0.5 font-mono hover:cursor-pointer outline-none w-full"
				name="status"
				id="status"
				bind:value={$bug.details.status}
			>
				<option value="fixed">Fixed</option>
				<option value="beingfixed">Being Fixed</option>
				<option value="onhold">On Hold</option>
				<option value="abandoned">Abandoned</option>
			</select>
		</div>
		<div class="flex btns justify-center gap-3">
			<input
				class="bg-black text-white px-2 py-1 rounded-sm hover:cursor-pointer"
				type="submit"
				value="Save Changes"
			/>
			<input
				class="text-black text-sm border border-red-600 px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-red-600 hover:text-white transition-colors"
				type="button"
				value="Delete Bug"
				on:click={() => {
					dispatch('deleteBug', {
						id: $bug.id
					});
				}}
			/>
		</div>
		{#if w < 640}
			<button
				class=" sticky border border-black px-2 py-1 hover:text-white hover:bg-black mb-8"
				on:click={() => dispatch('closeBug')}
				transition:fly={{ y: 50, duration: 500 }}
			>
				Close
			</button>
		{/if}
	</form>
</div>

<style>
	div > form > div {
		width: 200px;
	}

	.btns {
		width: 100% !important;
	}
</style>
