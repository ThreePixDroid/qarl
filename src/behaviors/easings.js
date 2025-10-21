
// created by chatGPT
const PI2 = Math.PI * 2
const pow = Math.pow

export const easings = {
  reverse: (t) => 1 - t,
  linear: (t) => t,
  yoyo: (t) => 1 - Math.abs(1 - t * 2),

  inQuad: (t) => pow(t, 2),
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  inCubic: (t) => pow(t, 3),
  outCubic: (t) => (--t) * t * t + 1,
  inOutCubic: (t) => t < 0.5 ? 4 * pow(t, 3) : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  inQuart: (t) => pow(t, 4),
  outQuart: (t) => 1 - (--t) * pow(t, 3),
  inOutQuart: (t) => t < 0.5 ? 8 * pow(t, 4) : 1 - 8 * (--t) * t * t * t,

  inQuint: (t) => pow(t, 5),
  outQuint: (t) => 1 + (--t) * pow(t, 4),
  inOutQuint: (t) => t < 0.5 ? 16 * pow(t, 5) : 1 + 16 * (--t) * t * t * t * t,

  inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  outSine: (t) => Math.sin((t * Math.PI) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  inBack: (t, s = 1.70158) => t * t * ((s + 1) * t - s),
  outBack: (t, s = 1.70158) => ((t -= 1) * t * ((s + 1) * t + s) + 1),
  inOutBack: (t, s = 1.70158) =>
    (t *= 2) < 1
      ? 0.5 * (t * t * ((s * 1.525 + 1) * t - s * 1.525))
      : 0.5 * ((t -= 2) * t * ((s * 1.525 + 1) * t + s * 1.525) + 2),

  inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutExpo: (t) => (
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? 0.5 * Math.pow(2, 20 * t - 10)
          : 1 - 0.5 * Math.pow(2, -20 * t + 10)
  ),

  inElastic: (t, a = 1, p = 0.5) => (
    t === 0
      ? 0
      : t === 1
        ? 1
        : -a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / PI2 * Math.asin(1 / a)) * PI2) / p)
  ),
  outElastic: (t, a = 1, p = 0.5) => (
    t === 0
      ? 0
      : t === 1
        ? 1
        : a * Math.pow(2, -10 * t) * Math.sin(((t - p / PI2 * Math.asin(1 / a)) * PI2) / p) + 1
  ),
  inOutElastic: (t, a = 1, p = 0.5) => (
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -0.5 * a * Math.pow(2, 20 * t - 10) * Math.sin(((20 * t - 11.125) * PI2) / p)
          : 0.5 * a * Math.pow(2, -20 * t + 10) * Math.sin(((20 * t - 11.125) * PI2) / p) + 1
  )
}
