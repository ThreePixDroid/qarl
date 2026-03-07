import { Core } from './Core';
import { ManagerCreateConfig } from './common';

/**
 * Manager — creates, stores, and batch-updates animations.
 * Animations created via `.create()` are automatically registered in the Manager.
 * Call `.update(dt)` each frame (typically from a Loop) to advance all active animations.
 *
 * @example
 * const manager = new Manager();
 *
 * const anim = manager.create({
 *   target: mesh.position,
 *   from: { x: 0 },
 *   to: { x: 100 },
 *   time: 1000,
 *   on: { complete: () => console.log('done') },
 * });
 *
 * anim.play();
 * Loop.start(manager.update);
 */
export class Manager {
  /** Double-buffer: map iterated during the current frame. */
  _current: Map<number, Core>;

  /** Double-buffer: map accumulating animations for the next frame. */
  _next: Map<number, Core>;

  /**
   * Create a new animation, auto-detecting the type (Core, FromTo, or Curve).
   * The animation is not started — call `.play()`.
   *
   * Type detection:
   * - `config.points` → Curve
   * - `config.from` or `config.to` → FromTo
   * - otherwise → Core
   * - `config.creator` → custom class (must extend Core)
   *
   * Event binding shortcuts:
   * - `config.on` — persistent listeners (`.on()`)
   * - `config.once` — one-time listeners (`.once()`)
   *
   * @example
   * const anim = manager.create({
   *   target: obj,
   *   to: { x: 10 },
   *   time: 500,
   *   easing: 'outQuad',
   *   on: { update: (a) => render(a.target) },
   * });
   * anim.play();
   */
  create(config: ManagerCreateConfig): Core;

  /**
   * Advance all active animations by `dt` milliseconds.
   * Bound to the instance — safe to pass directly to `Loop.start()`.
   *
   * @example
   * Loop.start(manager.update);
   */
  update(dt: number): void;

  /**
   * Get a snapshot array of all currently playing animations.
   */
  getActiveAnimations(): Core[];

  /**
   * Move an animation to the active list (it will receive `.update()` calls).
   * Called automatically by `animation.play()` when a Manager is attached.
   */
  addToActive(animation: Core): void;

  /**
   * Remove an animation from the active list (stops receiving updates).
   * Called automatically by `animation.stop()` / `.pause()`.
   */
  removeFromActive(animation: Core): void;

  /**
   * Stop all active animations (calls `.stop()` on each).
   */
  stopAll(): void;

  /**
   * Stop all animations and clear active lists.
   */
  removeAll(): void;
}

/**
 * Pre-created global Manager singleton.
 * Convenient when you don't need multiple independent animation groups.
 *
 * @example
 * import { GlobalManager, Loop } from 'qarl';
 *
 * const anim = GlobalManager.create({ target: obj, to: { x: 10 }, time: 500 });
 * anim.play();
 * Loop.start(GlobalManager.update);
 */
export const GlobalManager: Manager;
