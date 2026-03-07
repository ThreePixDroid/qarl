import { getCreator } from "./getCreator.js";

class Manager {
  constructor() {
    this._current = new Map();
    this._next = new Map();
    this._updating = false;
    this._updated = new Set();
  }

  create({ on = {}, once = {}, ...config}) {
    const creator = getCreator(config);
    const animation = new creator(config, this);

    Object.keys(on).forEach((event) => {
      animation.on(event, on[event]);
    });

    Object.keys(once).forEach((event) => {
      animation.once(event, once[event]);
    });

    return animation;
  }

  update = (dt) => {
    this._updating = true;
    this._updated.clear();

    for (const [key, animation] of this._current) {
      this._next.set(key, animation);
      this._updated.add(key);
      this._current.delete(key);
      animation.step(dt);
    }

    this._updating = false;
    [this._current, this._next] = [this._next, this._current];
  }

  getActiveAnimations() {
    return Array.from(this._current.values());
  }

  addToActive(animation) {
    if (this._updating && this._updated.has(animation.index)) {
      this._next.set(animation.index, animation);
    } else {
      this._current.set(animation.index, animation);
    }
  }

  removeFromActive(animation) {
    this._current.delete(animation.index);
    this._next.delete(animation.index);
  }

  stopAll() {
    [...this._current.values()].forEach((animation) => {
      animation.stop();
    });
  }

  removeAll() {
    this.stopAll();
    this._current.clear();
    this._next.clear();
  }
}

export { Manager };
export const GlobalManager = new Manager();
