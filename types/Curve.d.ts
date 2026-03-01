import { Core } from './Core';
import { CurveSettings } from './common';

export class Curve extends Core {
  static DEFAULTS: CurveSettings;

  settings: CurveSettings;
  path: number[][];
  totalLength: number;
  properties: string[];

  constructor(overrides?: Partial<CurveSettings>, manager?: import('./Manager').Manager);
}
