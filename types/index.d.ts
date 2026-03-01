/**
 * qarl — simple animation library.
 *
 * Core concepts:
 * - **Core** — base animation class (timing, easing, events)
 * - **FromTo** — interpolates object properties between `from` and `to` values
 * - **Curve** — animates along a Catmull-Rom spline
 * - **Manager** — groups and batch-updates animations
 * - **Loop** — requestAnimationFrame wrapper with delta-time capping
 * - **play()** — quick-start: creates animation + Loop in one call
 *
 * @example
 * import { GlobalManager, Loop } from 'qarl';
 *
 * const anim = GlobalManager.create({
 *   target: mesh.position,
 *   to: { x: 10, y: 5 },
 *   time: 1000,
 *   easing: 'outQuad',
 * });
 *
 * anim.play();
 * Loop.start(GlobalManager.update);
 *
 * @packageDocumentation
 */

export { Core } from './Core';
export { Curve } from './Curve';
export { FromTo } from './FromTo';
export { DEFAULTS } from './defaults';
export { easings } from './easings';
export { EVENTS } from './events';
export { modes } from './modes';
export { Manager, GlobalManager } from './Manager';
export { Loop } from './Loop';
export { play } from './play';

export type {
  EasingFunction,
  ModeFunction,
  ProcessorFunction,
  CoreSettings,
  FromToSettings,
  CurveSettings,
  LoopOptions,
  ManagerCreateConfig,
  EasingName,
  ModeName,
  EventTypes,
} from './common';
