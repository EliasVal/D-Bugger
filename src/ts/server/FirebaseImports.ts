import admin from 'firebase-admin';

// @ts-ignore
const dev = process.env['NODE_ENV'] == 'development';

import { config } from 'dotenv';
!('FIREBASE_KEY' in process.env) && config();

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(dev ? process.env['DEV_FIREBASE_KEY'] : process.env['FIREBASE_KEY']),
    ),
    databaseURL: dev
      ? 'https://dbugger-dev-default-rtdb.europe-west1.firebasedatabase.app'
      : 'https://debugger-33265-default-rtdb.firebaseio.com',
    storageBucket: dev ? 'dbugger-dev.appspot.com' : 'debugger-33265.appspot.com',
  });
}

export const auth = admin.auth;
export const storage = admin.storage;
export const database = admin.database;
