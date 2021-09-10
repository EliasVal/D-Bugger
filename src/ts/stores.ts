import { getAuth, onAuthStateChanged } from './FirebaseImports';
import { browser } from '$app/env';
import { writable } from 'svelte/store';
import { DisplayToast } from './utils';
import type { User } from '@firebase/auth';
import type { Writable } from 'svelte/store';
import type { Bug, Project } from 'src/global';
import { base as tmpBase } from '$app/paths';

const uUpdate = () => {
  onAuthStateChanged(getAuth(), (u) => {
    if (u) {
      user.update(() => getAuth().currentUser);
    } else {
      user.update(() => null);

      if (!window.location.pathname.match(/(auth\/.+)$/gim)) {
        DisplayToast({ title: 'Log in to view your projects.', duration: 15000 });
      }
    }
  });
};

if (browser) uUpdate();

export const user: Writable<User> = writable();
export const bug: Writable<Bug> = writable(null);
export const project: Writable<Project> = writable(null);
export const isDisplayingDialogue = writable(false);
export const dialogueValues = writable(null);
export const isDisplayingLoading = writable(false);
export const isDisplayingBug = writable(false);
export const Toasts = writable([]);
export const isDisplayingProjectSettings = writable(false);
export const base = tmpBase ? tmpBase + '/' : '/';
