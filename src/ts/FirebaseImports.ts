import { getApps as GApps, initializeApp } from 'firebase/app';
import {
  getAuth as GAuth,
  onAuthStateChanged as oASC,
  browserLocalPersistence as BRL,
  signInWithEmailAndPassword as SIWEP,
  setPersistence as SP,
  createUserWithEmailAndPassword as CUWEP,
  updateProfile as UP,
  sendEmailVerification as SEV,
  signOut as SO,
} from 'firebase/auth';

import {
  ref as rf,
  set as st,
  update as upd,
  onValue as onV,
  getDatabase as gDB,
  get as gt,
  remove as rm,
  push as psh,
} from 'firebase/database';

// Code
if (GApps()?.length == 0) {
  initializeApp({
    apiKey: 'AIzaSyDEsY9qk16a2U9mCbl2g_397-rRIFs7WQs',
    authDomain: 'debugger-33265.firebaseapp.com',
    databaseURL: 'https://debugger-33265-default-rtdb.firebaseio.com',
    projectId: 'debugger-33265',
    storageBucket: 'debugger-33265.appspot.com',
    messagingSenderId: '678619391168',
    appId: '1:678619391168:web:7dd6c220b312cee48a7925',
    measurementId: 'G-SPZSDNP61E',
  });
}

export const getApp = GApps;

// Export Auth singletons
export const getAuth = GAuth;
export const onAuthStateChanged = oASC;
export const browserLocalPersistence = BRL;
export const signInWithEmailAndPassword = SIWEP;
export const setPersistence = SP;
export const createUserWithEmailAndPassword = CUWEP;
export const updateProfile = UP;
export const sendEmailVerification = SEV;
export const signOut = SO;

// Export DB Singletons
export const ref = rf;
export const set = st;
export const update = upd;
export const onValue = onV;
export const getDatabase = gDB;
export const get = gt;
export const remove = rm;
export const push = psh;
