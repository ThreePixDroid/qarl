import { EasingFunction, EasingName } from './common';

/**
 * Built-in easing functions.
 * Each function maps progress `t` (0..1) to an eased output.
 *
 * | Family   | In          | Out          | InOut          |
 * |----------|-------------|--------------|----------------|
 * | Quad     | `inQuad`    | `outQuad`    | `inOutQuad`    |
 * | Cubic    | `inCubic`   | `outCubic`   | `inOutCubic`   |
 * | Quart    | `inQuart`   | `outQuart`   | `inOutQuart`   |
 * | Quint    | `inQuint`   | `outQuint`   | `inOutQuint`   |
 * | Sine     | `inSine`    | `outSine`    | `inOutSine`    |
 * | Back     | `inBack`    | `outBack`    | `inOutBack`    |
 * | Expo     | `inExpo`    | `outExpo`    | `inOutExpo`    |
 * | Elastic  | `inElastic` | `outElastic` | `inOutElastic` |
 *
 * Special:
 * - `linear` — no easing (`t → t`)
 * - `reverse` — inverted (`t → 1 − t`)
 * - `yoyo` — triangle wave (`0 → 1 → 0`)
 *
 * @example
 * import { easings } from 'qarl';
 *
 * // Use as a function directly
 * const value = easings.outElastic(0.5);
 *
 * // Pass by name in config
 * { easing: 'outElastic' }
 *
 * // Or pass the function reference
 * { easing: easings.outElastic }
 */
export const easings: Record<EasingName, EasingFunction>;
