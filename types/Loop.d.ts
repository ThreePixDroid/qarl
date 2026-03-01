import { LoopOptions } from './common';

/**
 * Loop — requestAnimationFrame wrapper with delta-time capping.
 * Calls the provided callback every frame with `dt` in milliseconds.
 *
 * @example
 * // Static shorthand — create and start in one call
 * const loop = Loop.start((dt) => {
 *   manager.update(dt);
 * });
 *
 * // Stop later
 * loop.stop();
 *
 * @example
 * // Manual lifecycle
 * const loop = new Loop((dt) => console.log(dt), { maxDeltaTime: 50 });
 * loop.start();
 * // ...
 * loop.stop();
 */
export class Loop {
  /** The callback invoked each frame with `dt` (capped by `maxDeltaTime`). */
  callback: (dt: number) => void;

  /** Resolved options with defaults applied. */
  options: Required<LoopOptions>;

  /** Whether the loop is currently running. */
  isRunning: boolean;

  /** Timestamp of the previous frame (from `requestAnimationFrame`). */
  lastTime: number;

  /** Current `requestAnimationFrame` handle, or `null` if stopped. */
  animationId: number | null;

  /**
   * @param callback - Function called every frame with delta time in ms
   * @param options - Loop options
   */
  constructor(callback: (dt: number) => void, options?: LoopOptions);

  /**
   * Create a Loop and immediately start it.
   *
   * @example
   * const loop = Loop.start(manager.update);
   *
   * @param callback - Function called every frame with delta time in ms
   * @param options - Loop options
   * @returns The running Loop instance
   */
  static start(callback: (dt: number) => void, options?: LoopOptions): Loop;

  /** Start the loop. No-op if already running. */
  start(): void;

  /** Stop the loop and cancel the next animation frame. */
  stop(): void;

  /** Alias for `isRunning`. */
  get running(): boolean;
}
