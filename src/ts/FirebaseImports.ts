import { getApps, initializeApp } from 'firebase/app';
export {
  getAuth,
  onAuthStateChanged,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  setPersistence,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
  updateEmail,
} from 'firebase/auth';

export { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

export {
  ref,
  set,
  update,
  onValue,
  getDatabase,
  get,
  remove,
  push,
  orderByChild,
  equalTo,
  query,
} from 'firebase/database';

// Code
if (getApps()?.length == 0) {
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
