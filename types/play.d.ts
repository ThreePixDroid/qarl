import { Core } from './Core';
import { Curve } from './Curve';
import { FromTo } from './FromTo';
import {
  CoreAnimation,
  CreateConfigCurve,
  CreateConfigFromTo,
  CreateConfigWithCreator,
  ManagerCreateConfig,
} from './common';

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
export function play<T extends Core>(config: CreateConfigWithCreator<T>, async?: false): T;
export function play<T extends Core>(config: CreateConfigWithCreator<T>, async: true): Promise<void>;
export function play(config: CreateConfigCurve, async?: false): Curve;
export function play(config: CreateConfigCurve, async: true): Promise<void>;
export function play(config: CreateConfigFromTo, async?: false): FromTo;
export function play(config: CreateConfigFromTo, async: true): Promise<void>;
export function play(config: ManagerCreateConfig, async?: false): CoreAnimation;
export function play(config: ManagerCreateConfig, async: true): Promise<void>;
