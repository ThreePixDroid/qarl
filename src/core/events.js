/**
 * @property {string} PLAY - Event fired when the animation starts (before delay, if any).
 * @property {string} STOP - Event fired when the animation stops.
 * @property {string} BEGIN - Event fired when the actual animation begins (after delay, if any).
 * @property {string} UPDATE - Event fired when the animation updates (after progress and easing calculation).
 * @property {string} REPEAT - Event fired when the animation repeats, if repeat is set.
 * @property {string} COMPLETE - Event fired when the animation completes.
 */
export const EVENTS = {
  PLAY: 'play',
  STOP: 'stop',
  BEGIN: 'begin',
  UPDATE: 'update',
  REPEAT: 'repeat',
  COMPLETE: 'complete',
};
