import { dev } from '$app/env';
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
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
  sendPasswordResetEmail,
} from 'firebase/auth';

export { getDownloadURL, getStorage, ref as storageRef, uploadString } from 'firebase/storage';

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
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  startAt,
  limitToFirst,
  orderByKey,
} from 'firebase/database';

// Even though the name says token, it is totally harmless to leave the firebase token in the client code as it not the admin token.
// If it would've been the admin toke, it would be CATASTROPHIC to leave it here.
const appToken = dev
  ? {
      // Dev, localhost allowed.
      apiKey: 'AIzaSyCHgs-vVlDIFwlgv3TDfOqmRxwvfj7eEOo',
      authDomain: 'dbugger-dev.firebaseapp.com',
      databaseURL: 'https://dbugger-dev-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'dbugger-dev',
      storageBucket: 'dbugger-dev.appspot.com',
      messagingSenderId: '885149911621',
      appId: '1:885149911621:web:609fbf993bab3687a0b12c',
    }
  : {
      // Production, localhost disallowed.
      apiKey: 'AIzaSyDEsY9qk16a2U9mCbl2g_397-rRIFs7WQs',
      authDomain: 'debugger-33265.firebaseapp.com',
      databaseURL: 'https://debugger-33265-default-rtdb.firebaseio.com',
      projectId: 'debugger-33265',
      storageBucket: 'debugger-33265.appspot.com',
      messagingSenderId: '678619391168',
      appId: '1:678619391168:web:7dd6c220b312cee48a7925',
      measurementId: 'G-SPZSDNP61E',
    };

// Code
if (getApps()?.length == 0) {
  initializeApp(appToken);
}
