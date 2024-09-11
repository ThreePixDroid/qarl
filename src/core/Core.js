import { Notifier } from "../emitter/Notifier"
import { DEFAULTS } from "./defaults"
import { EVENTS } from "./events"

/**
 * Core - Main class for managing animations.
 * 
 * @class Core
 * @param {Object} [overrides={}] - Object for overriding default settings.
 * @param {Object} [EmitterClass=null] - Class for managing animation events.
 * 
 * @example
 * const animation = new Core({ time: 1000, easing: easings.inOutQuad });
 * animation.play();
 * 
 * @property {Object} DEFAULTS - Default settings.
 * @property {number} DEFAULTS.time - Animation duration.
 * @property {boolean} DEFAULTS.loop - Flag for infinite looping.
 * @property {function} DEFAULTS.easing - Function for controlling the animation effect.
 * @property {boolean} DEFAULTS.reversed - Flag for playing the animation in reverse.
 * @property {number} DEFAULTS.repeat - Number of animation repetitions.
 * @property {number} DEFAULTS.delay - Delay before the animation starts.
 * 
 * @property {Object} settings - Current animation settings.
 * @property {number} progress - Current animation progress.
 * @property {boolean} reversed - Indicates if the animation is played in reverse.
 */
export class Core {
    static DEFAULTS = DEFAULTS

    static _noop() { }

    static mergeConfigs(target, source) {
        for (let key in source) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {}
                }
                Core.mergeConfigs(target[key], source[key])
            } else {
                target[key] = source[key]
            }
        }
    }

    constructor(overrides = {}, EmitterClass = Notifier) {
        this.settings = {}
        this._emitter = EmitterClass ? new EmitterClass() : null
        this.reset(overrides)
    }

    /**
     * Sets internal animation states.
     * @private
     */
    _processState() {
        this.step = Core._noop
        this.progress = 0
        this.easeValue = 0
        this.elapsedTime = 0
        this.promise = null
        this._resolve = Core._noop
        this._refreshDynamicProps()
    }

    /**
     * Updates dynamic animation states.
     * @private
     */
    _refreshDynamicProps() {
        this.target = this.settings.target
        
        this.time = Math.max(this.settings.time, 0)
        this.repeat = this.settings.repeat > 0 ? this.settings.repeat : this.settings.loop ? Infinity : 0
        this.reversed = this.settings.reversed
        this.remainingDelay = this.settings.delay

        this._emitEvent = this._emitEvent || Core._noop
        this._emitUpdate = this._emitUpdate || Core._noop

        this._processEasing()
    }

    /**
     * Sets the easing function for the animation.
     * @private
     */
    _processEasing() {
        this._easing = this.reversed ? this._reversedEasing : this.settings.easing
        this._calculateEasing = this.settings.mode ? this.settings.mode.bind(this) : this._easing
    }

    /**
     * Calculates the reversed easing value.
     * @param {number} t - Progress time.
     * @returns {number} - Easing result for the reversed direction.
     * @private
     */
    _reversedEasing(t) {
        return this.settings.easing(1 - t)
    }

    /**
     * Updates animation progress and triggers the update event.
     * @private
     */
    _update() {
        this.progress = this.elapsedTime / this.time
        this.easeValue = this._calculateEasing(this.progress)
        this._emitUpdate(EVENTS.UPDATE, { progress: this.progress, ease: this.easeValue })
    }

    /**
     * Handles the delay before the animation starts.
     * @param {number} deltaTime - Time passed since the last step.
     * @private
     */
    _stepDelay(deltaTime) {
        this.remainingDelay -= deltaTime

        if (this.remainingDelay > 0) return

        this.step = this._stepTime
        this.step(Math.abs(this.remainingDelay))

        this.remainingDelay = this.settings.delay
    }

    /**
     * Handles animation time.
     * @param {number} [deltaTime=0] - Time passed since the last step.
     * @private
     */
    _stepTime(deltaTime = 0) {
        this.elapsedTime += deltaTime

        if (this.elapsedTime >= this.time) {
            this.elapsedTime = this.time
            this._update()
            this._complete()
        } else {
            this._update()
        }
    }

    /**
     * Called when the animation is complete.
     * @private
     */
    _complete() {
        if (this.repeat-- > 0) {
            this._repeat()
        } else {
            this._resolve()
            this.stop(false)
            this._emitEvent(EVENTS.COMPLETE)
        }
    }

    /**
     * Repeats the animation if repetitions are set.
     * @param {boolean} [withEvent=true] - Flag for triggering the repeat event.
     * @private
     */
    _repeat(withEvent = true) {
        this.remainingDelay = this.settings.repeatDelay
        this.elapsedTime = 0

        if (this.remainingDelay > 0) {
            this.step = this._stepDelay
        }

        this._update()
        withEvent && this._emitEvent(EVENTS.REPEAT)
    }

    /**
     * Logs a warning if the event emitter is not defined.
     * @returns {Core} The current instance for chaining.
     * @private
     */
    _noEmitter() {
        console.warn('Event emitter is not defined')
        return this
    }

    /**
     * Subscribes a handler to the specified event.
     * @param {string} event - Event name.
     * @param {function} handler - Event handler.
     * @param {boolean} [once=false] - Flag for one-time subscription.
     * @returns {Core} The current instance for chaining.
     */
    on(event, handler, once = false) {
        if (!this._emitter) return this._noEmitter()

        if (event === EVENTS.UPDATE) {
            this._emitUpdate = this._emitter.emit(event, handler)
        } else {
            this._emit = this._emitter.emit(event, handler)
        }

        once
            ? this._emitter.once(event, handler)
            : this._emitter.on(event, handler)

        return this
    }

    /**
     * Subscribes a handler to the specified event once.
     * @param {string} event - Event name.
     * @param {function} handler - Event handler.
     * @returns {Core} The current instance for chaining.
     */
    once(event, handler) {
        return this.on(event, handler, true)
    }

    /**
     * Unsubscribes a handler from the specified event.
     * @param {string} event - Event name.
     * @param {function} handler - Event handler.
     * @returns {Core} The current instance for chaining.
     */
    off(event, handler) {
        if (!this._emitter) return this._noEmitter()

        this._emitter.off(event, handler)
        return this
    }

    /**
     * Removes all handlers for the specified event.
     * @param {string} event - Event name.
     * @returns {Core} The current instance for chaining.
     */
    removeEvents(event) {
        if (!this._emitter) return this._noEmitter()

        this._emitEvent = Core._noop
        this._emitUpdate = Core._noop

        this._emitter.removeAllListeners(event)
        return this
    }

    /**
     * Resets settings to default values.
     * @param {Object} [newSettings=Core.DEFAULTS] - New settings.
     * @returns {Core} The current instance for chaining.
     */
    reset(newSettings = this.constructor.DEFAULTS) {
        this.settings = { ...this.constructor.DEFAULTS, ...newSettings }
        this._processState()
        return this
    }

    /**
     * Modifies the current animation settings.
     * @param {Object} [newSettings={}] - New settings.
     * @returns {Core} The current instance for chaining.
     */
    tweak(newSettings = {}) {
        Core.mergeConfigs(this.settings, newSettings)
        this._refreshDynamicProps()
        return this
    }

    /**
     * Sets the animation time.
     * @param {number} [time=0] - Time to set.
     * @returns {Core} The current instance for chaining.
     */
    seek(time = 0, callUpdate = true) {
        this.elapsedTime = Math.min(Math.max(time, 0), this.settings.time)
        callUpdate && this._update()
        return this
    }

    /**
     * Sets the animation progress.
     * @param {number} [progress=0] - Animation progress (from 0 to 1).
     * @returns {Core} The current instance for chaining.
     */
    setProgress(progress = 0, callUpdate = true) {
        this.seek(this.settings.time * progress, callUpdate)
        return this
    }

    /**
     * Toggles the animation direction (forward/reverse).
     * @returns {Core} The current instance for chaining.
     */
    reverse(callUpdate = false) {
        this.reversed = !this.reversed
        this.seek(this.settings.time - this.elapsedTime, callUpdate)
        this._processEasing()

        return this
    }

    /**
     * Starts the animation.
     * @param {boolean} [withEvent=true] - Flag for triggering the play event.
     * @returns {Core} The current instance for chaining.
     */
    play(withEvent = true) {
        if (this.isPlaying) return this

        withEvent && this._emitEvent(EVENTS.PLAY)
        if (this.remainingDelay > 0) {
            this.step = this._stepDelay
        } else {
            this.step = this._stepTime
            this._emitEvent(EVENTS.BEGIN)
        }

        return this
    }

    /**
     * Starts the animation and returns a Promise.
     * @param {Promise} [promise=this.promise] - Promise object to resolve on completion.
     * @returns {Promise} - A promise that resolves when the animation is complete.
     */
    playPromise(promise = this.promise) {
        this.play()
        this.promise = promise || new Promise(resolve => this._resolve = resolve)
        return this.promise
    }

    /**
     * Stops the animation.
     * @param {boolean} [withEvent=true] - Flag for triggering the stop event.
     * @returns {Core} The current instance for chaining.
     */
    stop(withEvent = true) {
        this._processState()
        withEvent && this._emitEvent(EVENTS.STOP)
        return this
    }

    /**
     * Pauses the animation.
     * @returns {Core} The current instance for chaining.
     */
    pause() {
        this.step = Core._noop
        this._emitEvent(EVENTS.PAUSE)
        return this
    }

    /**
     * Restarts the animation from the beginning.
     * @param {boolean} [withEvent=true] - Flag for triggering the replay event.
     * @returns {Core} The current instance for chaining.
     */
    replay(withEvent = true) {
        this.stop(withEvent)
        this.play(withEvent)
        return this
    }

    /**
     * Returns whether the animation is currently playing.
     * @returns {boolean} - true if the animation is playing, otherwise false.
     */
    get isPlaying() {
        return this.step !== Core._noop
    }
}
