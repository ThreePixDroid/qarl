import { Core } from './Core';
import { FromToSettings } from './common';

/**
 * FromTo — animates target properties by interpolating between `from` and `to` values.
 * Automatically detects numeric properties (including nested objects) and creates lerps.
 *
 * If only `from` is provided, current target values are used as `to` (and vice versa).
 *
 * @example
 * const anim = new FromTo({
 *   target: mesh.position,
 *   from: { x: 0, y: 0 },
 *   to: { x: 100, y: 200 },
 *   time: 1000,
 *   easing: 'outQuad',
 * });
 * anim.play();
 *
 * @example
 * // Nested properties
 * const anim = new FromTo({
 *   target: mesh,
 *   from: { position: { x: 0 }, scale: { x: 1 } },
 *   to: { position: { x: 10 }, scale: { x: 2 } },
 *   time: 500,
 * });
 *
 * @example
 * // Dynamic mode — from/to are re-read each frame
 * const anim = new FromTo({
 *   target: obj,
 *   from: startValues,
 *   to: endValues,
 *   dynamic: true,
 *   time: 1000,
 * });
 * // Changing startValues/endValues during animation takes effect immediately
 */
export class FromTo extends Core {
  /** Default settings for FromTo, extending Core.DEFAULTS with `from`, `to`, `dynamic`. */
  static DEFAULTS: FromToSettings;

  /** Current resolved settings. */
  settings: FromToSettings;

  /**
   * @param overrides - Settings to merge on top of `FromTo.DEFAULTS`
   * @param manager - Optional Manager instance to auto-register with
   */
  constructor(overrides?: Partial<FromToSettings>, manager?: import('./Manager').Manager);

  /**
   * Update `from` values on a live animation.
   * Calls `.tweak()` internally and rebuilds interpolation.
   *
   * @example
   * animation.from({ x: 50 }).play();
   *
   * @param from - New starting values
   * @returns `this` for chaining
   */
  from(from?: Record<string, any>): this;

  /**
   * Update `to` values on a live animation.
   * Calls `.tweak()` internally and rebuilds interpolation.
   *
   * @example
   * animation.to({ x: 200 }).play();
   *
   * @param to - New ending values
   * @returns `this` for chaining
   */
  to(to?: Record<string, any>): this;

  /**
   * Swap `from` and `to` values, effectively reversing the interpolation direction.
   * Unlike `.reverse()`, this swaps the actual values rather than inverting the easing.
   *
   * @example
   * animation.swap().replay();
   *
   * @returns `this` for chaining
   */
  swap(): this;
}
