import { Core } from './Core';
import { CurveSettings } from './common';

/**
 * Curve — animates target properties along a Catmull-Rom spline defined by keypoints.
 *
 * Auto-detects property mapping for 1D–3D points (`position.x`, `.y`, `.z`).
 * For higher dimensions or custom paths, provide `properties` explicitly.
 *
 * @example
 * // 3D path — properties auto-detected as position.x/y/z
 * const anim = new Curve({
 *   target: mesh,
 *   time: 2000,
 *   points: [
 *     [0, 0, 0],
 *     [5, 10, 0],
 *     [10, 0, 5],
 *     [0, 0, 0],
 *   ],
 *   easing: 'inOutSine',
 *   loop: true,
 * });
 * anim.play();
 *
 * @example
 * // Custom properties — 6D points controlling position + scale
 * const anim = new Curve({
 *   target: mesh,
 *   time: 3000,
 *   properties: ['position.x', 'position.y', 'position.z', 'scale.x', 'scale.y', 'scale.z'],
 *   points: [
 *     [0, 0, 0, 1, 1, 1],
 *     [5, 10, 0, 2, 0.5, 2],
 *     [0, 0, 0, 1, 1, 1],
 *   ],
 *   smoothing: 30,
 * });
 */
export class Curve extends Core {
  /** Default settings for Curve, extending Core.DEFAULTS with `points`, `properties`, `smoothing`. */
  static DEFAULTS: CurveSettings;

  /** Current resolved settings. */
  settings: CurveSettings;

  /** Generated spline path — array of interpolated points. */
  path: number[][];

  /** Total arc length of the generated path. */
  totalLength: number;

  /** Resolved property paths assigned from interpolated values each frame. */
  properties: string[];

  /**
   * @param overrides - Settings to merge on top of `Curve.DEFAULTS`
   * @param manager - Optional Manager instance to auto-register with
   */
  constructor(overrides?: Partial<CurveSettings>, manager?: import('./Manager').Manager);
}
