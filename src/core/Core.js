import EventEmitter from 'eventemitter3';
import { DEFAULTS } from "./defaults";
import { EVENTS } from "./events";
import { easings } from "../behaviors/easings";
import { modes } from "../behaviors/modes";

let index = 0;

/**
 * Core - Main class for managing animations.
 * @extends EventEmitter
 */
export class Core extends EventEmitter {

  on(...args) {
    super.on(...args);
    return this;
  }

  off(...args) {
    super.off(...args);
    return this;
  }

  once(...args) {
    super.once(...args);
    return this;
  }

  onComplete(...args) {
    super.on(EVENTS.COMPLETE, ...args);
    return this;
  }

  onUpdate(...args) {
    super.on(EVENTS.UPDATE, ...args);
    return this;
  }

  /**
   * Default settings for the Core class.
   * @static
   * @type {Object}
   */
  static DEFAULTS = DEFAULTS;

  /**
   * No-operation function.
   * @static
   * @private
   */
  static _noop() { }

  /**
   * Recursively merges configuration objects.
   * @static
   * @param {Object} target - Target object to merge into.
   * @param {Object} source - Source object to merge from.
   * @private
   */
  static mergeConfigs(target, source) {
    // Проверка на циклические ссылки
    if (target === source) {
      return;
    }

    Object.keys(source).forEach((key) => {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        Core.mergeConfigs(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }

  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Creates an instance of Core.
   * @param {Object} [overrides={}] - Object for overriding default settings.
   */
  constructor(overrides = {}, manager) {
    super();

    this.index = index++;
    this.overrides = overrides;

    this.settings = {};
    this.reset(overrides);

    if (manager) {
      this.manager = manager;
    }

    this.lastDeltaTime = 0;
  }

  /**
   * Sets internal animation states.
   * @private
   */
  _processState() {
    this.step = Core._noop;
    this.progress = 0;
    this.easeValue = 0;
    this.elapsedTime = 0;
    this.promise = null;
    this._resolve = Core._noop;
    this._refreshDynamicProps();
  }

  /**
   * Updates dynamic animation states.
   * @private
   */
  _refreshDynamicProps() {
    this.applyProcessors(this.settings);

    const { target, time, repeat, loop, reversed, delay } = this.settings;
    this.target = target;
    this.time = Math.max(time, 0);
    this.repeat = repeat > 0 ? repeat : loop ? Infinity : 0;
    this.reversed = reversed;
    this.remainingDelay = delay;

    this._processEasing();
  }

  /**
   * Sets the easing function for the animation.
   * @private
   */
  _processEasing() {
    // Поддержка строк для easing
    const easing = typeof this.settings.easing === 'string'
      ? easings[this.settings.easing] || easings.linear
      : this.settings.easing;

    this._easing = this.reversed ? this._reversedEasing : easing;

    // Поддержка строк для mode
    const mode = typeof this.settings.mode === 'string'
      ? modes[this.settings.mode]
      : this.settings.mode;

    this._calculateEasing = mode ? mode.bind(this) : this._easing;
  }

  /**
   * Calculates the reversed easing value.
   * @param {number} t - Progress time.
   * @returns {number} Easing result for the reversed direction.
   * @private
   */
  _reversedEasing = (t) => {
    return this.settings.easing(1 - t);
  }

  /**
   * Updates animation progress and triggers the update event.
   * @private
   */
  _update() {
    this.progress = this.elapsedTime / this.time;
    this.easeValue = this._calculateEasing(this.progress);
    this.emit(EVENTS.UPDATE, this);
  }

  /**
   * Handles the delay before the animation starts.
   * @param {number} deltaTime - Time passed since the last step.
   * @private
   */
  _stepDelay = (deltaTime) => {
    this.remainingDelay -= deltaTime;
    this.lastDeltaTime = deltaTime;

    if (this.remainingDelay > 0) return;

    this.step = this._stepTime;
    this.step(Math.abs(this.remainingDelay));
    this.remainingDelay = this.settings.delay;
  }

  /**
   * Handles animation time.
   * @param {number} [deltaTime=0] - Time passed since the last step.
   * @private
   */
  _stepTime = (deltaTime = 0) => {
    this.elapsedTime += deltaTime;
    this.lastDeltaTime = deltaTime;

    if (this.elapsedTime >= this.time) {
      this.elapsedTime = this.time;
      this._update();
      this._complete();

    } else {
      this._update();

    }
  }

  /**
   * Called when the animation is complete.
   * @private
   */
  _complete() {
    if (this.repeat-- > 0) {
      this._repeat();

    } else {
      this._resolve();
      this.stop(false);
      this.emit(EVENTS.COMPLETE);

    }
  }

  /**
   * Repeats the animation if repetitions are set.
   * @param {boolean} [withEvent=true] - Flag for triggering the repeat event.
   * @private
   */
  _repeat(withEvent = true) {
    this.remainingDelay = this.settings.repeatDelay;
    this.elapsedTime = 0;
    if (this.remainingDelay > 0) {
      this.step = this._stepDelay;
    }
    this._update();
    withEvent && this.emit(EVENTS.REPEAT);
  }

  /**
   * Resets settings to default values.
   * @param {Object} [newSettings=Core.DEFAULTS] - New settings.
   * @returns {Core} The current instance for chaining.
   */
  reset(newSettings = this.constructor.DEFAULTS) {
    this.settings = { ...this.constructor.DEFAULTS, ...newSettings };
    this._processState();
    return this;
  }

  applyProcessors(settings = this.settings) {
    settings.processors.forEach((processor) => {
      Core.mergeConfigs(settings, processor.call(this, settings) || {});
    });
  }

  /**
   * Modifies the current animation settings.
   * @param {Object} [newSettings={}] - New settings.
   * @returns {Core} The current instance for chaining.
   */
  tweak(newSettings = {}) {
    Core.mergeConfigs(this.settings, newSettings);
    this._refreshDynamicProps();
    return this;
  }

  /**
   * Sets the animation time.
   * @param {number} [time=0] - Time to set.
   * @param {boolean} [callUpdate=true] - Whether to call the update method.
   * @returns {Core} The current instance for chaining.
   */
  seek(time = 0, callUpdate = true) {
    this.elapsedTime = Math.min(Math.max(time, 0), this.time);
    callUpdate && this._update();
    return this;
  }

  /**
   * Sets the animation progress.
   * @param {number} [progress=0] - Animation progress (from 0 to 1).
   * @param {boolean} [callUpdate=true] - Whether to call the update method.
   * @returns {Core} The current instance for chaining.
   */
  setProgress(progress = 0, callUpdate = true) {
    return this.seek(this.time * progress, callUpdate);
  }

  /**
   * Toggles the animation direction (forward/reverse).
   * @param {boolean} [callUpdate=false] - Whether to call the update method.
   * @returns {Core} The current instance for chaining.
   */
  reverse(callUpdate = false) {
    this.reversed = !this.reversed;
    this.seek(this.time - this.elapsedTime, callUpdate);
    this._processEasing();
    return this;
  }

  /**
   * Starts the animation.
   * @param {boolean} [withEvent=true] - Flag for triggering the play event.
   * @returns {Core} The current instance for chaining.
   */
  play(withEvent = true) {
    if (this.isPlaying) return this;

    withEvent && this.emit(EVENTS.PLAY);

    if (this.remainingDelay > 0) {
      this.step = this._stepDelay;

    } else {
      this.step = this._stepTime;
      this.emit(EVENTS.BEGIN);

    }

    if (this.manager) {
      this.manager.addToActive(this);
    }

    return this;
  }

  /**
   * Starts the animation and returns a Promise.
   * @param {Promise} [promise=this.promise] - Promise object to resolve on completion.
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  playPromise(promise = this.promise) {
    this.play();
    this.promise = promise || new Promise(resolve => { this._resolve = resolve });
    return this.promise;
  }

  /**
   * Stops the animation.
   * @param {boolean} [withEvent=true] - Flag for triggering the stop event.
   * @returns {Core} The current instance for chaining.
   */
  stop(withEvent = true) {
    this._processState();

    withEvent && this.emit(EVENTS.STOP);

    if (this.manager) {
      this.manager.removeFromActive(this);
    }

    return this;
  }

  /**
   * Pauses the animation.
   * @returns {Core} The current instance for chaining.
   */
  pause() {
    this.step = Core._noop;

    if (this.manager) {
      this.manager.removeFromActive(this);
    }

    return this;
  }

  /**
   * Restarts the animation from the beginning.
   * @param {boolean} [withEvent=true] - Flag for triggering the replay event.
   * @returns {Core} The current instance for chaining.
   */
  replay(withEvent = false) {
    this.stop(withEvent);
    this.play(withEvent);
    return this;
  }

  /**
   * Returns whether the animation is currently playing.
   * @returns {boolean} true if the animation is playing, otherwise false.
   */
  get isPlaying() {
    return this.step !== Core._noop;
  }

  remove() {
    this.stop();
    this.manager.remove(this);
  }
}
