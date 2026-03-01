import { Core } from './Core';

export type EasingFunction = (t: number, ...args: number[]) => number;

export type ModeFunction = (this: Core, t: number) => number;

export type ProcessorFunction = (this: Core, settings: CoreSettings) => Partial<CoreSettings> | void;

export interface CoreSettings {
  processors: ProcessorFunction[];
  time: number;
  loop: boolean;
  mode: string | ModeFunction | null;
  delay: number;
  repeat: number;
  target: any;
  easing: string | EasingFunction;
  reversed: boolean;
  repeatDelay: number;
  autoApplyProcessors: boolean;
}

export interface FromToSettings extends CoreSettings {
  dynamic: boolean;
  from: Record<string, any> | null;
  to: Record<string, any> | null;
}

export interface CurveSettings extends CoreSettings {
  properties: string[] | null;
  points: number[][];
  smoothing: number;
}

export interface LoopOptions {
  maxDeltaTime?: number;
}

export interface ManagerCreateConfig extends Partial<CoreSettings> {
  on?: Record<string, (...args: any[]) => void>;
  once?: Record<string, (...args: any[]) => void>;
  from?: Record<string, any>;
  to?: Record<string, any>;
  points?: number[][];
  properties?: string[];
  smoothing?: number;
  dynamic?: boolean;
  creator?: typeof Core;
}

export type EasingName =
  | 'linear' | 'reverse' | 'yoyo'
  | 'inQuad' | 'outQuad' | 'inOutQuad'
  | 'inCubic' | 'outCubic' | 'inOutCubic'
  | 'inQuart' | 'outQuart' | 'inOutQuart'
  | 'inQuint' | 'outQuint' | 'inOutQuint'
  | 'inSine' | 'outSine' | 'inOutSine'
  | 'inBack' | 'outBack' | 'inOutBack'
  | 'inExpo' | 'outExpo' | 'inOutExpo'
  | 'inElastic' | 'outElastic' | 'inOutElastic';

export type ModeName = 'pingPong' | 'yoyo' | 'bounce';

export interface EventTypes {
  PLAY: 'play';
  STOP: 'stop';
  BEGIN: 'begin';
  UPDATE: 'update';
  REPEAT: 'repeat';
  COMPLETE: 'complete';
}
