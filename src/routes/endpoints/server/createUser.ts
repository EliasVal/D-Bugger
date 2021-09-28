import { auth, database } from '@ts/server/FirebaseImports';

export const post = (request) => {
  return new Promise((resolve) => {
    const body = JSON.parse(request.body);

    body.username = decodeURI(body.username)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Validate email address
    // E-Mail address regex: https://stackoverflow.com/a/46181/11420492
    if (
      !('email' in body) ||
      !body.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      resolve({ status: 406, body: { message: 'Please provide a valid E-Mail!' } });
      return;
    }
    // Check if a password that is at least 6 characters long was provided
    else if (!('password' in body) || decodeURI(body.password).length < 6) {
      resolve({
        status: 406,
        body: { message: 'Please provide a passsword that is at least 6 characters long!' },
      });
      return;
    }
    // Check if a username that is at least 3 characters long was provided
    else if (!('username' in body) || body.username.length < 3) {
      resolve({
        status: 406,
        body: { message: 'Please provide a username that is at least 3 characters long!' },
      });
      return;
    }

    if (
      body.username.match(
        /(n(1|i)g+((e|3)r|a))|(fag)|(a(((s|5)(s|5))|(r(s|5)(e|3))))|(fuck)|(twat)|(cunt)|(b(1|i)tch)|((s|5)h(1|i)t)|(wh(0|o)r(e|3))|((s|5)(e|3)x)|(c(0|o)ck)|(pu(s|5)(s|5)y)|(p(e|3)n(1|i)(s|5))|(vag(1|i)na)|(cl(1|i)t)|(cum)|((s|5)(e|3)m(e|3)n)|((s|5)lut)|(p(e|3)d(0|o))|(m(0|o)l(e|3)(s|5)t)|(dyk(e|3))|(trap)|(h(1|i)tl(e|3)r)|(l(0|o)l(1|i))|((s|5)h(0|o)ta)|((s|5)u(1|i)c(1|i)d(e|3))|(wank(e|3)r)|(rap((e|3)|(1|i)(s|5)t))/gim,
      )
    ) {
      resolve({
        status: 406,
        body: {
          message: 'Your username was deemed offensive, please try again with a different name.',
        },
      });
      return;
    }

    auth()
      .createUser({
        email: decodeURI(body.email),
        emailVerified: false,
        password: decodeURI(body.password),
        displayName: body.username,
      })
      .then(async (user) => {
        await database().ref(`users/${user.uid}/displayName`).set(body.username);
        resolve({ status: 200, body: { message: 'User created successfully!' } });
      })
      .catch((e) => {
        let message = '';
        switch (e.code.substring(5)) {
          case 'email-already-exists':
          case 'email-already-in-use':
            message = 'A user with this E-Mail already exists!';
            break;
          case 'too-many-requests':
            message = "Due to unusual activity, you've been timed out. Please try again later.";
            break;
          case 'internal-error':
            message = 'Something went wrong!';
            break;
          case 'invalid-email':
            message = 'Invalid E-Mail entered!';
            break;
          case 'weak-password':
            message = 'Your password is too weak!';
            break;
          default:
            message = e.message;
            break;
        }
        resolve({ status: 406, body: { message } });
      });
  });
};
