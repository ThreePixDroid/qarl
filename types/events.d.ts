import { EventTypes } from './common';

/**
 * Animation lifecycle event name constants.
 *
 * | Constant   | Value        | When it fires                                |
 * |------------|--------------|----------------------------------------------|
 * | `PLAY`     | `'play'`     | `.play()` called (before delay)              |
 * | `STOP`     | `'stop'`     | `.stop()` called                             |
 * | `BEGIN`    | `'begin'`    | Animation actually starts (after delay)      |
 * | `UPDATE`   | `'update'`   | Every frame, after progress/easing computed   |
 * | `REPEAT`   | `'repeat'`   | Each repetition starts                       |
 * | `COMPLETE` | `'complete'` | All repetitions finished                     |
 *
 * @example
 * import { EVENTS } from 'qarl';
 *
 * animation.on(EVENTS.UPDATE, (anim) => {
 *   console.log(anim.progress);
 * });
 */
export const EVENTS: EventTypes;
