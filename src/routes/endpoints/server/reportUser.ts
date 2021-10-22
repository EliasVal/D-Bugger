export const post = (request) => {
  const body = JSON.parse(request.body);
  return new Promise(async (resolve) => {
    // Import FB because cannot use top-level await
    const fb = await (await import('@ts/server/FirebaseImports')).default;

    if (body.reportTopic.match(/^pfp|username$/)?.length == 0) {
      resolve({ status: 406, body: { message: 'Missing Report Topic!' } });
      return;
    } else if (!('target' in body)) {
      resolve({ status: 406, body: { message: 'Missing Report Target!' } });
      return;
    }

    const target = decodeURI(body.target);

    // Check if user exists
    const snapshot = await fb.database().ref(`users/${target}`).get();
    if (!snapshot.exists()) {
      resolve({ status: 406, body: { message: 'This user does not exist!' } });
      return;
    }

    const decodedToken = await fb
      .auth()
      .verifyIdToken(decodeURI(body.token))
      .catch(() =>
        resolve({ status: 401, body: { message: "You're not allowed to perform this action!" } }),
      );

    if (decodedToken) {
      if (target == decodedToken.uid) {
        resolve({ status: 406, body: { message: 'You cannot report yourself!' } });
        return;
      }

      const reportsSnapshot = await fb
        .database()
        .ref(`reports/${target}/${decodedToken.uid}`)
        .get();
      if (reportsSnapshot.exists()) {
        resolve({ status: 406, body: { message: 'You already reported this user!' } });
        return;
      } else {
        fb.database()
          .ref(`reports/${target}/${decodedToken.uid}`)
          .set({
            topic: body.reportTopic,
            reportDetails: body.reportDetails ?? null,
            time: Date.now(),
          })
          .then(() => {
            resolve({
              status: 200,
              body: { message: 'User reported successfully!' },
            });
          })
          .catch(() =>
            resolve({
              status: 500,
              body: { message: 'Something went wrong, please try again later.' },
            }),
          );
      }
    }
  });
};
