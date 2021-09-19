const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const admin = require("firebase-admin");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.DB_URL,
});

let failedUsers = [];

readline.question(
  "Select the type of message:\n[1] Opt-in notification | (Default)\n[2] Forced notification\n",
  (choice) => {
    if (!choice.match(/^[1-2]$/)) choice = "1";
    admin
      .database()
      .ref("/users/")
      .once("value", (usersSnapshot) => {
        let count = 0;
        usersSnapshot.forEach((u) => {
          if (choice == "1") {
            admin
              .database()
              .ref(`users/${u.key}/optInMessages`)
              .get()
              .then((v) => {
                if (v.val())
                  sendMessageToUser(u.key).then(() => {
                    count++;
                    compareAndClose(count, usersSnapshot.numChildren());
                  });
                else {
                  count++;
                  compareAndClose(count, usersSnapshot.numChildren());
                }
              });
          } else {
            sendMessageToUser(u.key).then(() => {
              count++;
              compareAndClose(count, usersSnapshot.numChildren());
            });
          }
        });
      });
  }
);

function compareAndClose(count, length) {
  if (count == length) {
    console.log("Finished sending messages to all users!\n\n");
    if (failedUsers.length > 0) {
      console.log("Failed Sending messages to:");
      console.log(failedUsers);
    }
    process.exit();
  }
}

function sendMessageToUser(UID) {
  console.log(`\x1b[33mSending Message to ${UID}...\x1b[0m`);
  return new Promise((resolve, reject) => {
    admin
      .database()
      .ref(`/users/${UID}/inbox`)
      .push({
        // DO NOT CHANGE THESE
        type: "message",
        read: "false",
        // -------------------

        title: "Update!",
        description: "New update is out!",
        // Supporst Markdown
        content:
          "This is a test message for an update we're more than happy to announce! come on in!",
      })
      .then(() => {
        console.log(`\x1b[32mMessage sent successfully to ${UID}!\x1b[0m`);
      })
      .catch(() => {
        console.log(`\x1b[31mFailed to send message to ${UID}!\x1b[0m`);
        failedUsers.push(UID);
      })
      .finally(() => resolve());
  });
}
