import { getAuth, onAuthStateChanged } from './FirebaseImports';
import { browser } from '$app/env';
import { Writable, writable } from 'svelte/store';
import { DisplayToast } from './utils';
import type { User } from '@firebase/auth';

const uUpdate = () => {
  onAuthStateChanged(getAuth(), (u) => {
    if (u) {
      user.update(() => getAuth().currentUser);
    } else {
      user.update(() => null);
      DisplayToast({ title: 'Log in to view your projects.', duration: 15000 });
    }
  });
};

if (browser) uUpdate();

export const user: Writable<User> = writable();
export const bug = writable(null);
export const project = writable(null);
export const isDisplayingDialogue = writable(false);
export const dialogueValues = writable(null);
export const isDisplayingLoading = writable(false);
export const isDisplayingBug = writable(false);
export const Toasts = writable([]);
export const isDisplayingProjectSettings = writable(false);
