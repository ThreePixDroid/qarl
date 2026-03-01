import { Core } from './Core';
import { FromToSettings } from './common';

export class FromTo extends Core {
  static DEFAULTS: FromToSettings;

  settings: FromToSettings;

  constructor(overrides?: Partial<FromToSettings>, manager?: import('./Manager').Manager);

  from(from?: Record<string, any>): this;
  to(to?: Record<string, any>): this;
  swap(): this;
}
