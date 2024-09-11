
    // created by chatGPT
    const PI2 = Math.PI * 2

    export const easings = {
        reverse: (t) => 1 - t,
        linear: (t) => t,
        yoyo: (t) => 1 - Math.abs(1 - t * 2),

        inQuad: (t) => t * t,
        outQuad: (t) => t * (2 - t),
        inOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

        inCubic: (t) => t * t * t,
        outCubic: (t) => (--t) * t * t + 1,
        inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

        inQuart: (t) => t * t * t * t,
        outQuart: (t) => 1 - (--t) * t * t * t,
        inOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

        inQuint: (t) => t * t * t * t * t,
        outQuint: (t) => 1 + (--t) * t * t * t * t,
        inOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

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