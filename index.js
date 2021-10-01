const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const admin = require("firebase-admin");

// Change this if you want to test the message in your Dev Database
const dev = false;

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      dev ? process.env["DEV_FIREBASE_KEY"] : process.env["FIREBASE_KEY"]
    )
  ),
  databaseURL: dev
    ? "https://dbugger-dev-default-rtdb.europe-west1.firebasedatabase.app"
    : "https://debugger-33265-default-rtdb.firebaseio.com",
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

        title: "D-Bugger v0.1.1",
        description: "Future of D-Bugger, Security, Profiles and More!",
        // Supporst Markdown
        content:
          "A new version of D-Bugger is out!<br>" +
          "<i>What's new?</i><br><br>" +
          "<strong>UI:</strong><br>" +
          "- Tweaked the animations of the Inbox in & out<br>" +
          "- Improved mobile UI<br><br>" +
          "<strong>User Profiles:</strong><br>" +
          "- Usernames and Profile Pictures will now be scanned for profanity and offensive content.<br>" +
          "- You can now report users for containing offensive content or profanity in their Profile Picture and/or username<br><br>" +
          "<strong>Security:</strong><br>" +
          "- Moved Updating Profile Pictures, Updating usernames, Sign-up and html sanitization to the server side.<br><br>" +
          "<strong><i>What's to come in the next update?</i></strong><br>" +
          "We're aiming to bring more stuff to the projects side of things, which means that you should expect some new stuff to play with and try in your project!",
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
