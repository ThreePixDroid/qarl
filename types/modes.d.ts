import { ModeFunction, ModeName } from './common';

/**
 * Built-in animation modes.
 * Modes wrap the easing function to create composite effects.
 *
 * - `pingPong` — forward then backward: `easing(t*2)` for first half, `1 - easing((t-0.5)*2)` for second.
 * - `yoyo` — easing applied to a triangle wave: `easing(1 - |1 - t*2|)`.
 * - `bounce` — triangle wave applied after easing: `1 - |1 - easing(t)*2|`.
 *
 * @example
 * import { modes } from 'qarl';
 *
 * // Pass by name
 * { mode: 'pingPong', easing: 'outQuad' }
 *
 * // Or pass the function reference
 * { mode: modes.pingPong, easing: 'outQuad' }
 */
export const modes: Record<ModeName, ModeFunction>;
