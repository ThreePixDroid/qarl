import EventEmitter from 'eventemitter3';
import { CoreSettings } from './common';

export class Core extends EventEmitter {
  static DEFAULTS: CoreSettings;
  static lerp(a: number, b: number, t: number): number;
  static mergeConfigs(target: object, source: object): void;

  index: number;
  overrides: Partial<CoreSettings>;
  settings: CoreSettings;
  progress: number;
  easeValue: number;
  elapsedTime: number;
  target: any;
  time: number;
  repeat: number;
  reversed: boolean;
  remainingDelay: number;
  lastDeltaTime: number;
  manager?: import('./Manager').Manager;

  constructor(overrides?: Partial<CoreSettings>, manager?: import('./Manager').Manager);

  step(deltaTime: number): void;

  on(event: string, fn: (...args: any[]) => void, context?: any): this;
  off(event: string, fn: (...args: any[]) => void, context?: any): this;
  once(event: string, fn: (...args: any[]) => void, context?: any): this;
  onComplete(fn: (animation: this) => void, context?: any): this;
  onUpdate(fn: (animation: this) => void, context?: any): this;
  onceComplete(fn: (animation: this) => void, context?: any): this;

  reset(newSettings?: Partial<CoreSettings>): this;
  applyProcessors(settings?: CoreSettings): void;
  tweak(newSettings?: Partial<CoreSettings>): this;
  seek(time?: number, callUpdate?: boolean): this;
  setProgress(progress?: number, callUpdate?: boolean): this;
  reverse(callUpdate?: boolean): this;
  play(withEvent?: boolean): this;
  playPromise(promise?: Promise<void>): Promise<void>;
  stop(withEvent?: boolean): this;
  pause(): this;
  replay(withEvent?: boolean): this;
  remove(): void;

  get isPlaying(): boolean;
}
