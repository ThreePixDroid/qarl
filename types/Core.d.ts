import EventEmitter from 'eventemitter3';
import { CoreSettings, EasingFunction } from './common';

/**
 * Core — base animation class built on EventEmitter3.
 * Manages timing, easing, delays, repeats, and lifecycle events.
 * Extended by FromTo (property interpolation) and Curve (spline animation).
 *
 * @example
 * const anim = new Core({ time: 1000, easing: 'outQuad', loop: true });
 * anim.onUpdate((a) => console.log(a.progress, a.easeValue));
 * anim.play();
 *
 * @example
 * // With promise
 * await anim.playPromise();
 * console.log('animation complete');
 */
export class Core extends EventEmitter {
  /** Default settings applied to every new instance. */
  static DEFAULTS: CoreSettings;

  /**
   * Linear interpolation between two values.
   * @param a - Start value
   * @param b - End value
   * @param t - Interpolation factor (0..1)
   * @returns Interpolated value
   */
  static lerp(a: number, b: number, t: number): number;

  /**
   * Deep-merge `source` into `target`, mutating `target` in place.
   * Nested objects are merged recursively; primitives are overwritten.
   */
  static mergeConfigs(target: object, source: object): void;

  /** Unique numeric index assigned at construction. */
  index: number;

  /** Original overrides passed to the constructor. */
  overrides: Partial<CoreSettings>;

  /** Current resolved settings (defaults merged with overrides). */
  settings: CoreSettings;

  /** Current animation progress (0..1), before easing. */
  progress: number;

  /** Current eased value (0..1 for standard easings, can overshoot for elastic/back). */
  easeValue: number;

  /** Elapsed time in milliseconds since animation started. */
  elapsedTime: number;

  /** Reference to `settings.target`. */
  target: any;

  /** Resolved animation duration in milliseconds (≥ 0). */
  time: number;

  /** Remaining repetitions. */
  repeat: number;

  /** Whether the animation is currently playing in reverse. */
  reversed: boolean;

  /** Remaining delay before next step in milliseconds. */
  remainingDelay: number;

  /** Delta time from the most recent `step()` call. */
  lastDeltaTime: number;

  /** The Manager this animation belongs to, if any. */
  manager?: import('./Manager').Manager;

  /**
   * @param overrides - Settings to merge on top of `Core.DEFAULTS`
   * @param manager - Optional Manager instance to auto-register with
   */
  constructor(overrides?: Partial<CoreSettings>, manager?: import('./Manager').Manager);

  /**
   * Advance the animation by `deltaTime` milliseconds.
   * Called by Manager or Loop each frame.
   * Internally delegates to delay/time step based on current state.
   */
  step(deltaTime: number): void;

  /**
   * Subscribe to an event. Returns `this` for chaining.
   * @param event - Event name: `'play'` | `'stop'` | `'begin'` | `'update'` | `'repeat'` | `'complete'`
   * @param fn - Callback
   * @param context - Optional `this` context for the callback
   */
  on(event: string, fn: (...args: any[]) => void, context?: any): this;

  /**
   * Unsubscribe from an event. Returns `this` for chaining.
   * @param event - Event name
   * @param fn - The exact function reference that was passed to `.on()`
   * @param context - The context that was passed to `.on()`
   */
  off(event: string, fn: (...args: any[]) => void, context?: any): this;

  /**
   * Subscribe to an event, auto-removed after first fire. Returns `this` for chaining.
   * @param event - Event name
   * @param fn - Callback
   * @param context - Optional `this` context for the callback
   */
  once(event: string, fn: (...args: any[]) => void, context?: any): this;

  /**
   * Shorthand for `.on('complete', fn)`. Returns `this` for chaining.
   *
   * @example
   * animation.onComplete(() => console.log('done')).play();
   */
  onComplete(fn: (animation: this) => void, context?: any): this;

  /**
   * Shorthand for `.on('update', fn)`. Returns `this` for chaining.
   *
   * @example
   * animation.onUpdate((a) => {
   *   console.log(a.progress, a.easeValue);
   * });
   */
  onUpdate(fn: (animation: this) => void, context?: any): this;

  /**
   * Shorthand for `.once('complete', fn)`. Returns `this` for chaining.
   * Callback fires once on the next complete, then is removed.
   */
  onceComplete(fn: (animation: this) => void, context?: any): this;

  /**
   * Reset the animation to its initial state.
   * Merges `newSettings` (or DEFAULTS) and re-initializes all internal state.
   * @param newSettings - New settings to apply (defaults to `DEFAULTS`)
   * @returns `this` for chaining
   */
  reset(newSettings?: Partial<CoreSettings>): this;

  /**
   * Manually apply all processor functions to the current settings.
   * Called automatically if `autoApplyProcessors` is `true`.
   */
  applyProcessors(settings?: CoreSettings): void;

  /**
   * Modify settings on a live animation without resetting progress.
   * Deep-merges `newSettings` into current `settings` and refreshes dynamic props.
   *
   * @example
   * animation.tweak({ time: 500, easing: 'inOutCubic' });
   *
   * @returns `this` for chaining
   */
  tweak(newSettings?: Partial<CoreSettings>): this;

  /**
   * Jump to a specific time in the animation.
   * @param time - Target time in milliseconds, clamped to [0, this.time]
   * @param callUpdate - Whether to fire the UPDATE event (default: `true`)
   * @returns `this` for chaining
   */
  seek(time?: number, callUpdate?: boolean): this;

  /**
   * Jump to a specific progress value.
   * @param progress - Target progress (0..1)
   * @param callUpdate - Whether to fire the UPDATE event (default: `true`)
   * @returns `this` for chaining
   */
  setProgress(progress?: number, callUpdate?: boolean): this;

  /**
   * Toggle animation direction. Flips `reversed` and adjusts `elapsedTime`
   * so the animation continues from the mirrored position.
   * @param callUpdate - Whether to fire the UPDATE event (default: `false`)
   * @returns `this` for chaining
   */
  reverse(callUpdate?: boolean): this;

  /**
   * Start the animation.
   * If a delay is set, transitions to delay state first (PLAY fires immediately, BEGIN fires after delay).
   * No-op if already playing.
   * @param withEvent - Whether to emit the PLAY event (default: `true`)
   * @returns `this` for chaining
   *
   * @example
   * animation.play();
   */
  play(withEvent?: boolean): this;

  /**
   * Start the animation and return a Promise that resolves on complete.
   *
   * @example
   * await animation.playPromise();
   * // animation finished
   *
   * @param promise - Optional existing promise to reuse
   * @returns Promise that resolves when the animation completes
   */
  playPromise(promise?: Promise<void>): Promise<void>;

  /**
   * Stop the animation, reset internal state (`progress`, `elapsedTime`, etc.).
   * Removes from Manager's active list.
   * @param withEvent - Whether to emit the STOP event (default: `true`)
   * @returns `this` for chaining
   */
  stop(withEvent?: boolean): this;

  /**
   * Pause the animation at its current position.
   * Call `.play()` to resume from the paused point.
   * @returns `this` for chaining
   */
  pause(): this;

  /**
   * Stop and immediately play again from the beginning.
   * @param withEvent - Whether to emit STOP/PLAY events (default: `false`)
   * @returns `this` for chaining
   */
  replay(withEvent?: boolean): this;

  /**
   * Remove this animation from its Manager (both active and all lists).
   * Calls `.stop()` first.
   */
  remove(): void;

  /**
   * `true` if the animation is currently advancing (not paused/stopped).
   */
  get isPlaying(): boolean;
}
