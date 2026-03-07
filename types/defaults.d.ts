import { CoreSettings } from './common';

/**
 * Default animation settings applied to every Core instance.
 *
 * ```
 * {
 *   processors: [],
 *   time: 0,
 *   loop: false,
 *   mode: null,
 *   delay: 0,
 *   repeat: 0,
 *   target: null,
 *   easing: (t) => t,    // linear
 *   reversed: false,
 *   repeatDelay: 0,
 *   autoApplyProcessors: false,
 * }
 * ```
 */
export const DEFAULTS: CoreSettings;
