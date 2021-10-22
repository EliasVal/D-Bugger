// Dont cancel me on twitter for this, I'm trying to keep the usernames clean.
// Feel free to copy this into your own project.
const badWordRegex =
  /(n(1|i)g+((e|3)r|a))|(fag)|(a(((s|5)(s|5))|(r(s|5)(e|3))))|(fuck)|(twat)|(cunt)|(b(1|i)tch)|((s|5)h(1|i)t)|(wh(0|o)r(e|3))|((s|5)(e|3)x)|(c(0|o)ck)|(pu(s|5)(s|5)y)|(p(e|3)n(1|i)(s|5))|(vag(1|i)na)|(cl(1|i)t)|(cum)|((s|5)(e|3)m(e|3)n)|((s|5)lut)|(p(e|3)d(0|o))|(m(0|o)l(e|3)(s|5)t)|(dyk(e|3))|(trap)|(h(1|i)tl(e|3)r)|(l(0|o)l(1|i))|((s|5)h(0|o)ta)|((s|5)u(1|i)c(1|i)d(e|3))|(wank(e|3)r)|(rap((e|3)|(1|i)(s|5)t))/gim;

export const post = (request) => {
  return new Promise(async (resolve) => {
    // Import FB because cannot use top-level await
    const fb = await (await import('@ts/server/FirebaseImports')).default;

    const body = JSON.parse(request.body);
    const newUsername = decodeURI(body.newUsername);
    const cleanusername = newUsername.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    fb.auth()
      .verifyIdToken(decodeURI(body.token))
      .then(async (decodedToken) => {
        if (cleanusername.match(badWordRegex)) {
          resolve({
            status: 406,
            body: {
              message:
                'Your username was deemed offensive, please try again with a different name.',
            },
          });
          return;
        }
        await fb.auth().updateUser(decodedToken.uid, {
          displayName: newUsername,
        });
        await fb.database().ref(`users/${decodedToken.uid}/displayName`).set(newUsername);
        resolve({
          status: 200,
          body: {
            message: 'Username updated successfully!',
          },
        });
      })
      .catch(() =>
        resolve({ status: 401, body: { message: "You're not allowed to perform this action!" } }),
      );
  });
};
