import { browser } from '$app/env';
import { base as tmpBase } from '$app/paths';

import type { User } from '@firebase/auth';
import type { Bug, Project } from 'src/global';
import type { Writable } from 'svelte/store';

import { writable } from 'svelte/store';

import { getAuth, onAuthStateChanged } from './FirebaseImports';
import { DisplayToast } from './utils';

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
export const imageCache: Writable<string> = writable(null);
export const isDisplayingDialogue = writable(false);
export const dialogueValues = writable(null);
export const isDisplayingLoading = writable(false);
export const isDisplayingBug = writable(false);
export const Toasts = writable([]);
export const sortingType = writable('id');
export const isDisplayingProjectSettings = writable(false);
export const searchQuery = writable('');
export const base = tmpBase ? tmpBase + '/' : '/';
