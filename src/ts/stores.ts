import { getAuth, onAuthStateChanged } from './FirebaseImports';

import { writable } from 'svelte/store';
import { browser } from '$app/env';

const uUpdate = () => {
	onAuthStateChanged(getAuth(), (u) => {
		if (u) {
			// @ts-ignore
			user.update(() => getAuth().currentUser.toJSON());
		} else {
			user.update(() => null);
		}
	});
};

if (browser) uUpdate();

export const user = writable('unknown');
export const bug = writable(null);
export const project = writable(null);
export const isDisplayingDialogue = writable(false);
export const dialogueValues = writable(null);
export const isDisplayingLoading = writable(false);
export const isDisplayingBug = writable(false);
export const Toasts = writable([]);
export const isDisplayingProjectSettings = writable(false);
