import sanitize from 'sanitize-html';

export const post = (request) => {
  const content = decodeURI(request.headers.content);

  return {
    body: {
      // isOffensive: username.match(badWordRegex)?.length > 0,
      content: encodeURI(
        sanitize(content, {
          allowedTags: ['pre', 'span', 'code', 'a', 'i', 'b', 'strong', 'em', 'p'],
          allowedAttributes: {
            pre: ['style'],
            a: ['href'],
            span: ['class'],
          },
        }),
      ),
    },
  };
};
