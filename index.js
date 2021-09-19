var admin = require("firebase-admin");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.DB_URL,
});

let failedUsers = [];

admin
  .database()
  .ref("/users/")
  .once("value", (usersSnapshot) => {
    let count = 0;
    usersSnapshot.forEach((u) => {
      console.log(`Sending Message to ${u.key}...`);
      admin
        .database()
        .ref(`/users/${u.key}/inbox`)
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
          count++;
          console.log(`Message sent successfully to ${u.key}!`);
          if (count == usersSnapshot.numChildren()) {
            console.log("Finished sending messages to all users!\n\n");
            if (failedUsers.length > 0) {
              console.log("Failed Sending messages to:");
              console.log(failedUsers);
            }
            process.exit();
          }
        })
        .catch(() => {
          failedUsers.push(u.key);
          count++;
        });
    });
  });
