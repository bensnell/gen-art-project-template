// Random number generator
class RNG {
  constructor() {
    let _ = this;

    // Use A
    _.U = false;

    // sfc32
    let s = function (u) { // uint128Hex
      let [a, b, c, d] = [0, 8, 16, 24].map(i => parseInt(u.substr(i, 8), 16));
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      }
    };

    // seed prngA with first half of tokenData.hash
    // seed prngB with second half of tokenData.hash
    [_.A, _.B] = [2, 34].map(i => new s(tokenData.hash.substr(i, 32)));

    for (let i = 0; i < 1e6; i += 2) {
      _.A();
      _.B();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  d() {
    let _ = this;
    _.U = !_.U;
    return _.U ? _.A() : _.B();
  }
  // random number between a (inclusive) and b (exclusive)
  n(a, b) {
    return a + (b - a) * this.d();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  i(a, b) {
    return FL(this.n(a, b + 1));
  }
  // Random gaussian
  g(m = 0, s = 1, l = 1, h = 1) { // l and h are multipliers applied to the lo's (<0) and hi's (>0)
    let _ = this,
      a = 0,
      b = 0,
      o;
    while (a === 0) a = _.d();
    while (b === 0) b = _.d();
    o = sqrt(-2 * log(a)) * cos(2 * PI * b);
    return o * [o > 0 ? h : l] * s + m;
  }
}