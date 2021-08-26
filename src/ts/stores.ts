// Packages
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';
import { browser } from '$app/env';

let app;
// Code
if (getApps().length == 0) {
	app = initializeApp({
		apiKey: 'AIzaSyDEsY9qk16a2U9mCbl2g_397-rRIFs7WQs',
		authDomain: 'debugger-33265.firebaseapp.com',
		databaseURL: 'https://debugger-33265-default-rtdb.firebaseio.com',
		projectId: 'debugger-33265',
		storageBucket: 'debugger-33265.appspot.com',
		messagingSenderId: '678619391168',
		appId: '1:678619391168:web:7dd6c220b312cee48a7925',
		measurementId: 'G-SPZSDNP61E'
	});
}

const uUpdate = () => {
	onAuthStateChanged(auth, (u) => {
		if (u) {
			// @ts-ignore
			user.update(() => auth.currentUser.toJSON());
		} else {
			user.update(() => null);
		}
	});
};

let auth;
if (browser) {
	auth = getAuth(app);
	uUpdate();
}

export const user = writable('unknown');
export const bug = writable(null);
export const project = writable(null);
export const isDisplayingDialogue = writable(false);
export const dialogueValues = writable(null);
export const isDisplayingLoading = writable(false);
export const isDisplayingBug = writable(false);
export const Toasts = writable([]);
export const isDisplayingProjectSettings = writable(false);
