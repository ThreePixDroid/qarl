import { Core } from './Core';
import { CoreSettings, FromToSettings, CurveSettings } from './common';

export function play(config: Partial<CoreSettings | FromToSettings | CurveSettings>, async?: false): Core;
export function play(config: Partial<CoreSettings | FromToSettings | CurveSettings>, async: true): Promise<void>;
