import { Core } from './Core';

/**
 * Easing function that maps progress `t` (0..1) to an output value.
 * Can accept additional parameters for parametric easings (e.g. `inBack(t, overshoot)`).
 *
 * @example
 * const customEasing: EasingFunction = (t) => t * t;
 *
 * @example
 * const parametric: EasingFunction = (t, strength = 1.5) => t * strength;
 */
export type EasingFunction = (t: number, ...args: number[]) => number;

/**
 * Mode function that wraps an easing to create composite effects (ping-pong, yoyo, etc.).
 * Called with `this` bound to the Core instance, giving access to `this._easing`.
 *
 * @example
 * const customMode: ModeFunction = function(t) {
 *   return t <= 0.5
 *     ? this._easing(t * 2)
 *     : 1 - this._easing((t - 0.5) * 2);
 * };
 */
export type ModeFunction = (this: Core, t: number) => number;

/**
 * Processor function — middleware that can modify animation settings before each play.
 * Called with `this` bound to the Core instance.
 * Return a partial settings object to merge, or void to modify `settings` in place.
 *
 * @example
 * const randomDelay: ProcessorFunction = function(settings) {
 *   return { delay: Math.random() * 1000 };
 * };
 */
export type ProcessorFunction = (this: Core, settings: CoreSettings) => Partial<CoreSettings> | void;

/**
 * Base configuration for all animations.
 */
export interface CoreSettings {
  /**
   * Array of processor functions applied before each play.
   * Processors can dynamically modify settings (e.g. randomize delay, compute values).
   * @default []
   */
  processors: ProcessorFunction[];

  /**
   * Duration of the animation in milliseconds.
   * @default 0
   */
  time: number;

  /**
   * If `true`, the animation repeats indefinitely.
   * Overrides `repeat` — sets it to `Infinity`.
   * @default false
   */
  loop: boolean;

  /**
   * Animation mode that wraps the easing function.
   * Pass a built-in name (`'pingPong'`, `'yoyo'`, `'bounce'`) or a custom `ModeFunction`.
   * @default null
   */
  mode: ModeName | ModeFunction | null;

  /**
   * Delay before the animation starts, in milliseconds.
   * The `BEGIN` event fires after the delay; `PLAY` fires immediately.
   * @default 0
   */
  delay: number;

  /**
   * Number of times to repeat after the first play.
   * `0` = play once, `1` = play twice, etc. Ignored if `loop` is `true`.
   * @default 0
   */
  repeat: number;

  /**
   * The object whose properties will be animated.
   * For FromTo/Curve — the object receiving interpolated values.
   * For bare Core — available via `this.target` in event handlers.
   * @default null
   */
  target: any;

  /**
   * Easing function or a built-in easing name.
   * Controls the animation curve (acceleration/deceleration).
   *
   * Built-in names: `'linear'`, `'inQuad'`, `'outQuad'`, `'inOutQuad'`,
   * `'inCubic'`, `'outCubic'`, `'inOutCubic'`, `'inElastic'`, `'outElastic'`, etc.
   *
   * @default (t) => t  // linear
   */
  easing: EasingName | EasingFunction;

  /**
   * If `true`, the easing is applied in reverse direction.
   * @default false
   */
  reversed: boolean;

  /**
   * Delay between repetitions in milliseconds.
   * Only relevant when `repeat > 0` or `loop` is `true`.
   * @default 0
   */
  repeatDelay: number;

  /**
   * If `true`, processors are re-applied automatically before each `play()`.
   * If `false`, processors are only applied on `reset()`.
   * @default true
   */
  autoApplyProcessors: boolean;
}

/**
 * Configuration for FromTo animations.
 * Extends CoreSettings with `from`/`to` value objects.
 */
export interface FromToSettings extends CoreSettings {
  /**
   * If `true`, `from` and `to` are re-read each frame, allowing external changes.
   * If `false`, deltas are precomputed once for better performance.
   * @default false
   */
  dynamic: boolean;

  /**
   * Starting values. Shape must mirror the `target` object's structure.
   * If omitted, current values of `target` matching `to` keys are used.
   *
   * @example
   * { position: { x: 0, y: 0 }, scale: { x: 1 } }
   * @default null
   */
  from: Record<string, any> | null;

  /**
   * Ending values. Shape must mirror the `target` object's structure.
   * If omitted, current values of `target` matching `from` keys are used.
   *
   * @example
   * { position: { x: 100, y: 200 }, scale: { x: 2 } }
   * @default null
   */
  to: Record<string, any> | null;
}

/**
 * Configuration for Curve (Catmull-Rom spline) animations.
 * Extends CoreSettings with keypoint arrays.
 */
export interface CurveSettings extends CoreSettings {
  /**
   * Property paths on `target` to assign interpolated values.
   * Each string is a dot-separated path (e.g. `'position.x'`).
   * If omitted and points have 1–3 dimensions, defaults to `position.x`, `.y`, `.z`.
   *
   * @example
   * ['position.x', 'position.y', 'rotation.z']
   * @default null
   */
  properties: string[] | null;

  /**
   * Array of keypoints for the spline. Each point is a number array
   * whose length must match `properties.length`.
   *
   * @example
   * [[0, 0, 0], [5, 10, 0], [10, 0, 0]]
   * @default []
   */
  points: number[][];

  /**
   * Number of interpolation steps between each pair of keypoints.
   * Higher values produce smoother curves at the cost of memory.
   * @default 20
   */
  smoothing: number;
}

/**
 * Options for the animation loop.
 */
export interface LoopOptions {
  /**
   * Maximum allowed delta time per frame in milliseconds.
   * Prevents large jumps when the tab is backgrounded.
   * @default 100
   */
  maxDeltaTime?: number;
}

/**
 * Configuration for `Manager.create()`.
 * Combines CoreSettings with FromTo/Curve fields and event binding shortcuts.
 * The correct animation type (Core, FromTo, or Curve) is auto-detected.
 */
export interface ManagerCreateConfig extends Partial<CoreSettings> {
  /**
   * Event listeners attached via `.on()` (persistent).
   *
   * @example
   * { update: (anim) => console.log(anim.progress) }
   */
  on?: Record<string, (...args: any[]) => void>;

  /**
   * Event listeners attached via `.once()` (fire once, then removed).
   *
   * @example
   * { complete: () => console.log('done') }
   */
  once?: Record<string, (...args: any[]) => void>;

  /** Starting values (triggers FromTo animation). */
  from?: Record<string, any>;

  /** Ending values (triggers FromTo animation). */
  to?: Record<string, any>;

  /** Keypoints (triggers Curve animation). */
  points?: number[][];

  /** Property paths for Curve animation. */
  properties?: string[];

  /** Smoothing for Curve animation. */
  smoothing?: number;

  /** Dynamic mode for FromTo animation. */
  dynamic?: boolean;

  /**
   * Custom animation class to use instead of auto-detection.
   * Must be a subclass of Core (e.g. a custom controller).
   */
  creator?: typeof Core;
}

/**
 * Built-in easing function names.
 *
 * Families: Quad, Cubic, Quart, Quint, Sine, Back, Expo, Elastic.
 * Each family has `in`, `out`, and `inOut` variants.
 *
 * Special: `'linear'` (no easing), `'reverse'` (1 − t), `'yoyo'` (triangle wave).
 */
export type EasingName =
  | 'linear' | 'reverse' | 'yoyo'
  | 'inQuad' | 'outQuad' | 'inOutQuad'
  | 'inCubic' | 'outCubic' | 'inOutCubic'
  | 'inQuart' | 'outQuart' | 'inOutQuart'
  | 'inQuint' | 'outQuint' | 'inOutQuint'
  | 'inSine' | 'outSine' | 'inOutSine'
  | 'inBack' | 'outBack' | 'inOutBack'
  | 'inExpo' | 'outExpo' | 'inOutExpo'
  | 'inElastic' | 'outElastic' | 'inOutElastic';

/**
 * Built-in animation mode names.
 *
 * - `'pingPong'` — forward then backward using the easing.
 * - `'yoyo'` — easing applied to a triangle wave.
 * - `'bounce'` — triangle wave applied after easing.
 */
export type ModeName = 'pingPong' | 'yoyo' | 'bounce';

/**
 * Event name constants used with `.on()` / `.once()` / `.emit()`.
 */
export interface EventTypes {
  /** Fires when `.play()` is called (before delay). */
  PLAY: 'play';
  /** Fires when `.stop()` is called. */
  STOP: 'stop';
  /** Fires when the animation actually begins (after delay). */
  BEGIN: 'begin';
  /** Fires every frame with updated `progress` and `easeValue`. */
  UPDATE: 'update';
  /** Fires on each repetition. */
  REPEAT: 'repeat';
  /** Fires when all repetitions are done. */
  COMPLETE: 'complete';
}
