import { easings } from "./easings"

/**
     * Object containing animation modifiers.
     * @namespace
     * @property {function} pingPong - Implements ping-pong effect for animation.
     * @property {function} yoyo - Implements mirror reflection effect for animation.
     * @property {function} bounce - Implements bounce effect for animation.
     * @example
     * const animation = new Core({ time: 1000, mode: modes.pingPong })
     * animation.play()
     * @see {@link Core}
     * @see {@link easings}
     */
export const modes = {
  /**
   * Implements ping-pong effect for animation.
   * @param {number} t - Current animation time.
   * @returns {number} Modified time value for ping-pong effect.
   */
  pingPong: function (t) {
    return t <= 0.5
      ? this._easing(t * 2)
      : 1 - this._easing((t - 0.5) * 2)
  },

  /**
   * Implements mirror reflection effect for animation.
   * @param {number} t - Current animation time.
   * @returns {number} Modified time value for mirror reflection effect.
   */
  yoyo: function (t) {
    return this._easing(easings.yoyo(t))
  },

  /**
   * Implements bounce effect for animation.
   * @param {number} t - Current animation time.
   * @returns {number} Modified time value for bounce effect.
   */
  bounce: function (t) {
    return easings.yoyo(this._easing(t))
  },
}
