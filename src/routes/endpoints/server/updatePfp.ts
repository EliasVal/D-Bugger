import { node } from '@tensorflow/tfjs-node';
import { load } from 'nsfwjs';

export const post = (request) => {
  const body = JSON.parse(request.body);
  return new Promise(async (resolve) => {
    // Import FB because cannot use top-level await
    const fb = await (await import('@ts/server/FirebaseImports')).default;

    const model = await load();

    const image = node.decodeImage(
      Buffer.from(body.originalImgB64.replace(/^data:image\/(png|jpeg);base64,/, ''), 'base64'),
      3,
    );

    // @ts-ignore
    const predictions = await model.classify(image);
    image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).

    let nsfw = false;
    for (const prediction of predictions) {
      if (
        (prediction.className == 'Porn' ||
          prediction.className == 'Hentai' ||
          prediction.className == 'Sexy') &&
        prediction.probability > 0.45
      ) {
        nsfw = true;
      }
    }

    if (nsfw) {
      resolve({
        status: 406,
        body: {
          message:
            'The selected image was deemed to be explicit. Please try again with a different image.',
        },
      });
      return;
    }

    const decodedToken = await fb
      .auth()
      .verifyIdToken(decodeURI(body.token))
      .catch(() =>
        resolve({ status: 401, body: { message: "You're not allowed to perform this action!" } }),
      );

    // @ts-ignore
    if (decodedToken?.uid) {
      const bufferStream = Buffer.from(
        body.resizedImgB64.replace(/^data:image\/(png|jpeg);base64,/, ''),
        'base64',
      );

      fb.storage()
        .bucket()
        .file(`${decodedToken.uid}/profilePicture`)
        .save(
          bufferStream,
          {
            metadata: { contentType: 'image/jpeg' },
          },
          (error) => {
            if (error) {
              resolve({ status: 500, body: { message: 'Something went wrong!' } });
            }
            resolve({ status: 200, body: { message: 'Profile Picture updated successfully!' } });
          },
        );
    }
  });
};
