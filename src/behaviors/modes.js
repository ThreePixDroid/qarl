import { easings } from "./easings"

/**
     * Объект, содержащий модификаторы анимации.
     * @namespace
     * @property {function} pingPong - Реализует пинг-понг эффект для анимации.
     * @property {function} yoyo - Реализует эффект зеркального отражения анимации.
     * @property {function} bounce - Реализует эффект отскока для анимации.
     * @example
     * const animation = new Core({ time: 1000, mode: modes.pingPong })
     * animation.play()
     * @see {@link Core}
     * @see {@link easings}
     */
export const modes = {
  /**
   * Реализует пинг-понг эффект для анимации.
   * @param {number} t - Текущее время анимации.
   * @returns {number} Измененное значение времени для эффекта пинг-понг.
   */
  pingPong: function (t) {
    return t <= 0.5
      ? this._easing(t * 2)
      : 1 - this._easing((t - 0.5) * 2)
  },

  /**
   * Реализует эффект зеркального отражения анимации.
   * @param {number} t - Текущее время анимации.
   * @returns {number} Измененное значение времени для эффекта зеркального отражения.
   */
  yoyo: function (t) {
    return this._easing(easings.yoyo(t))
  },

  /**
   * Реализует эффект отскока для анимации.
   * @param {number} t - Текущее время анимации.
   * @returns {number} Измененное значение времени для эффекта отскока.
   */
  bounce: function (t) {
    return easings.yoyo(this._easing(t))
  },
}
