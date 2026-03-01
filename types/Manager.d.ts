import { Core } from './Core';
import { ManagerCreateConfig } from './common';

export class Manager {
  activeAnimations: Map<number, Core>;
  allAnimations: Map<number, Core>;

  create(config: ManagerCreateConfig): Core;
  update(dt: number): void;
  getActiveAnimations(): Core[];
  getAllAnimations(): Core[];
  remove(animation: { index?: number }): void;
  add(animation: Core): void;
  addToActive(animation: Core): void;
  removeFromActive(animation: Core): void;
  stopAll(): void;
  removeAll(): void;
}

export const GlobalManager: Manager;
