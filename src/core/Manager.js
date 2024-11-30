import * as QARL from "../index.js";

class Manager {
  constructor() {
    this.activeAnimations = new Map();
    this.allAnimations = new Map();
  }

  create(config) {
    if (!config.creator && !config.points && !(config.from || config.to)) {
      throw new Error("Invalid animation config");
    }

    const animation = config.creator
      ? new config.creator(config, this)
      : config.points
        ? new QARL.Curve(config, this)
        : new QARL.FromTo(config, this);


    this.add(animation);

    return animation;
  }

  update(dt) {
    this.activeAnimations.forEach((animation) => {
      animation.step(dt);
    });
  }

  getActiveAnimations() {
    return Array.from(this.activeAnimations.values());
  }

  getAllAnimations() {
    return Array.from(this.allAnimations.values()); 
  }

  remove({ index } = {}) {
    if (!index) return;
    
    this.activeAnimations.delete(index);
    this.allAnimations.delete(index);
  }

  add(animation) {
    this.allAnimations.set(animation.index, animation);
  }

  addToActive(animation) {
    this.activeAnimations.set(animation.index, animation);
  }

  removeFromActive(animation) {
    this.activeAnimations.delete(animation.index);
  }

  stopAll() {
    this.activeAnimations.forEach((animation) => {
      animation.stop();
    })
  }

  removeAll() {
    this.stopAll();
    this.activeAnimations.clear();
    this.allAnimations.clear();
  }
}

export { Manager };