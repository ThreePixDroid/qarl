/**
 * Default configuration options for animations.
 * @property {number} time - Duration of the animation in milliseconds.
 * @property {boolean} loop - Whether the animation should loop indefinitely.
 * @property {function|null} mode - Custom function to modify the easing behavior (optional).
 * @property {number} delay - Delay before the animation starts, in milliseconds.
 * @property {number} repeat - Number of times to repeat the animation (0 means no repeat).
 * @property {*} target - The target object or value for the animation.
 * @property {function} easing - Easing function to use for the animation.
 * @property {boolean} reversed - Whether the animation should play in reverse.
 * @property {number} repeatDelay - Delay between repetitions of the animation, in milliseconds.
 */
export const DEFAULTS = {
  processors: [],
  time: 0,
  loop: false,
  mode: null,
  delay: 0,
  repeat: 0,
  target: null,
  easing: t => t,
  reversed: false,
  repeatDelay: 0,
  autoApplyProcessors: false,
};
