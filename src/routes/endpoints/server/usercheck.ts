export const post = (request) => {
  const username = request.headers.username;

  // Dont cancel me on twitter for this, I'm trying to keep the usernames clean.
  // Feel free to take this into your own project.
  const badWordRegex =
    /(n(1|i)g+((e|3)r|a))|(fag)|(a(((s|5)(s|5))|(r(s|5)(e|3))))|(fuck)|(twat)|(cunt)|(b(1|i)tch)|((s|5)h(1|i)t)|(wh(0|o)r(e|3))|((s|5)(e|3)x)|(c(0|o)ck)|(pu(s|5)(s|5)y)|(p(e|3)n(1|i)(s|5))|(vag(1|i)na)|(cl(1|i)t)|(cum)|((s|5)(e|3)m(e|3)n)|((s|5)lut)|(p(e|3)d(0|o))|(m(0|o)l(e|3)(s|5)t)|(dyk(e|3))|(trap)|(h(1|i)tl(e|3)r)|(l(0|o)l(1|i))|((s|5)h(0|o)ta)|((s|5)u(1|i)c(1|i)d(e|3))|(wank(e|3)r)|(rap((e|3)|(1|i)(s|5)t))/gim;
  return {
    body: {
      isOffensive: username.match(badWordRegex)?.length > 0,
    },
  };
};
