import { Core } from './Core';
import { CoreSettings, FromToSettings, CurveSettings } from './common';

/**
 * Quick-start function — creates an animation, starts a Loop, and plays it.
 * Auto-detects the animation type (Core, FromTo, or Curve) from the config.
 *
 * @example
 * // Synchronous — returns the animation instance
 * const anim = play({
 *   target: mesh.position,
 *   to: { x: 10 },
 *   time: 1000,
 * });
 *
 * @example
 * // Async — returns a Promise that resolves on complete
 * await play({
 *   target: mesh.position,
 *   to: { x: 10 },
 *   time: 1000,
 * }, true);
 * console.log('animation finished');
 *
 * @param config - Animation settings (type is auto-detected)
 * @param async - If `true`, returns a Promise instead of the animation
 */
export function play(config: Partial<CoreSettings | FromToSettings | CurveSettings>, async?: false): Core;
export function play(config: Partial<CoreSettings | FromToSettings | CurveSettings>, async: true): Promise<void>;
