import { easings } from '../behaviors/easings'

/**
 * @property {Object} DEFAULTS - Default settings.
 * @property {number} DEFAULTS.time - Animation duration.
 * @property {boolean} DEFAULTS.loop - Flag for infinite looping.
 * @property {function} DEFAULTS.easing - Function for controlling the animation effect.
 * @property {boolean} DEFAULTS.reversed - Flag for playing the animation in reverse.
 * @property {number} DEFAULTS.repeat - Number of animation repetitions.
 * @property {number} DEFAULTS.delay - Delay before the animation starts.
 */
export const DEFAULTS = {
  time: 0,
  loop: false,
  mode: null,
  delay: 0,
  repeat: 0,
  target: null,
  easing: easings.linear,
  reversed: false,
  repeatDelay: 0,
}