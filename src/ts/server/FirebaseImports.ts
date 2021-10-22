import admin from 'firebase-admin';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { config } from 'dotenv';
// @ts-ignore
const dev = process.env['NODE_ENV'] == 'development';
const client = new SecretManagerServiceClient();

async function accessSecretVersion() {
  config();
  await client.accessSecretVersion({
    name: `projects/678619391168/secrets/${
      dev ? 'DEV_FIREBASE_KEY' : 'FIREBASE_KEY'
    }/versions/latest`,
  });

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

  return { database: admin.database, auth: admin.auth, storage: admin.storage };
}

export default accessSecretVersion();
