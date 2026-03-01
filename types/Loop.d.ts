import { LoopOptions } from './common';

export class Loop {
  callback: (dt: number) => void;
  options: Required<LoopOptions>;
  isRunning: boolean;
  lastTime: number;
  animationId: number | null;

  constructor(callback: (dt: number) => void, options?: LoopOptions);

  static start(callback: (dt: number) => void, options?: LoopOptions): Loop;

  start(): void;
  stop(): void;

  get running(): boolean;
}
