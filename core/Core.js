import { Notifier } from "../emitter/Notifier"
import { DEFAULTS } from "../core/defaults"
import { EVENTS } from "../core/events"


/**
 * Core - Основной класс для управления анимациями.
 * 
 * @class Core
 * @param {Object} [overrides={}] - Объект для переопределения настроек по умолчанию.
 * @param {Object} [EmitterClass=null] - Класс для управления событиями анимации.
 * 
 * @example
 * const animation = new Core({ time: 1000, easing: easings.inOutQuad });
 * animation.play();
 * 
 * @property {Object} DEFAULTS - Настройки по умолчанию.
 * @property {number} DEFAULTS.time - Время анимации.
 * @property {boolean} DEFAULTS.loop - Флаг бесконечного повторения анимации.
 * @property {function} DEFAULTS.easing - Функция для управления эффектом анимации.
 * @property {boolean} DEFAULTS.reversed - Флаг обратного проигрывания анимации.
 * @property {number} DEFAULTS.repeat - Количество повторений анимации.
 * @property {number} DEFAULTS.delay - Задержка перед началом анимации.
 * 
 * @property {Object} settings - Текущие настройки анимации.
 * @property {number} progress - Текущий прогресс анимации.
 * @property {boolean} reversed - Указывает, проигрывается ли анимация в обратном направлении.
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
   * Устанавливает внутренние состояния анимации.
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
   * Обновляет динамические состояния анимации.
   * @private
   */
  _refreshDynamicProps() {
      this.time = Math.max(this.settings.time, 0)
      this.repeat = this.settings.repeat > 0 ? this.settings.repeat : this.settings.loop ? Infinity : 0
      this.reversed = this.settings.reversed
      this.remainingDelay = this.settings.delay

      this._emitEvent = this._emitEvent || Core._noop
      this._emitUpdate = this._emitUpdate || Core._noop

      this._processEasing()
  }

  /**
   * Устанавливает функцию easing для анимации.
   * @private
   */
  _processEasing() {
      this._easing = this.reversed ? this._reversedEasing : this.settings.easing
      this._calculateEasing = this.settings.mode ? this.settings.mode.bind(this) : this._easing
  }

  /**
   * Рассчитывает обратное значение easing.
   * @param {number} t - Время прогресса.
   * @returns {number} - Результат функции easing для обратного направления.
   * @private
   */
  _reversedEasing(t) {
      return this.settings.easing(1 - t)
  }

  /**
   * Обновляет прогресс анимации и вызывает событие обновления.
   * @private
   */
  _update() {
      this.progress = this.elapsedTime / this.time
      this.easeValue = this._calculateEasing(this.progress)
      this._emitUpdate(EVENTS.UPDATE, { progress: this.progress, ease: this.easeValue })
  }

  /**
   * Обрабатывает задержку перед началом анимации.
   * @param {number} deltaTime - Время, прошедшее с предыдущего шага.
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
   * Обрабатывает время анимации.
   * @param {number} [deltaTime=0] - Время, прошедшее с предыдущего шага.
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
   * Вызывается при завершении анимации.
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
   * Повторяет анимацию, если установлены повторения.
   * @param {boolean} [withEvent=true] - Флаг для вызова события повторения.
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
   * Логирует предупреждение, если эмиттер событий не определен.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   * @private
   */
  _noEmitter() {
      console.warn('Event emitter is not defined')
      return this
  }

  /**
   * Подписывает обработчик на указанное событие.
   * @param {string} event - Имя события.
   * @param {function} handler - Обработчик события.
   * @param {boolean} [once=false] - Флаг для одноразовой подписки.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
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
   * Подписывает одноразовый обработчик на указанное событие.
   * @param {string} event - Имя события.
   * @param {function} handler - Обработчик события.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  once(event, handler) {
      return this.on(event, handler, true)
  }

  /**
   * Отписывает обработчик от указанного события.
   * @param {string} event - Имя события.
   * @param {function} handler - Обработчик события.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  off(event, handler) {
      if (!this._emitter) return this._noEmitter()

      this._emitter.off(event, handler)
      return this
  }

  /**
   * Удаляет все обработчики для указанного события.
   * @param {string} event - Имя события.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  removeEvents(event) {
      if (!this._emitter) return this._noEmitter()

      this._emitEvent = Core._noop
      this._emitUpdate = Core._noop

      this._emitter.removeAllListeners(event)
      return this
  }

  /**
   * Сбрасывает настройки к значениям по умолчанию.
   * @param {Object} [newSettings=Core.DEFAULTS] - Новые настройки.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  reset(newSettings = this.constructor.DEFAULTS) {
      this.settings = { ...this.constructor.DEFAULTS, ...newSettings }
      this._processState()
      return this
  }

  /**
   * Изменяет текущие настройки анимации.
   * @param {Object} [newSettings={}] - Новые настройки.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  tweak(newSettings = {}) {
      Core.mergeConfigs(this.settings, newSettings)
      this._refreshDynamicProps()
      return this
  }

  /**
   * Устанавливает время анимации.
   * @param {number} [time=0] - Время для установки.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  seek(time = 0, callUpdate = true) {
      this.elapsedTime = Math.min(Math.max(time, 0), this.settings.time)
      callUpdate && this._update()
      return this
  }

  /**
   * Устанавливает прогресс анимации.
   * @param {number} [progress=0] - Прогресс анимации (от 0 до 1).
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  setProgress(progress = 0, callUpdate = true) {
      this.seek(this.settings.time * progress, callUpdate)
      return this
  }

  /**
   * Меняет направление анимации (прямое/обратное).
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  reverse(callUpdate = false) {
      this.reversed = !this.reversed
      this.seek(this.settings.time - this.elapsedTime, callUpdate)
      this._processEasing()

      return this
  }

  /**
   * Запускает анимацию.
   * @param {boolean} [withEvent=true] - Флаг для вызова события при запуске.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
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
   * Запускает анимацию с возвращением Promise.
   * @param {Promise} [promise=this.promise] - Объект Promise для разрешения по завершению.
   * @returns {Promise} - Promise, который разрешится при завершении анимации.
   */
  playPromise(promise = this.promise) {
      this.play()
      this.promise = promise || new Promise(resolve => this._resolve = resolve)
      return this.promise
  }

  /**
   * Останавливает анимацию.
   * @param {boolean} [withEvent=true] - Флаг для вызова события при остановке.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  stop(withEvent = true) {
      this._processState()
      withEvent && this._emitEvent(EVENTS.STOP)
      return this
  }

  /**
   * Приостанавливает анимацию.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  pause() {
      this.step = Core._noop
      this._emitEvent(EVENTS.PAUSE)
      return this
  }

  /**
   * Повторно запускает анимацию с начального состояния.
   * @param {boolean} [withEvent=true] - Флаг для вызова события при перезапуске.
   * @returns {Core} Текущий экземпляр для цепочек вызовов.
   */
  replay(withEvent = true) {
      this.stop(withEvent)
      this.play(withEvent)
      return this
  }

  /**
   * Возвращает, активна ли анимация.
   * @returns {boolean} - true, если анимация воспроизводится, иначе false.
   */
  get isPlaying() {
      return this.step !== Core._noop
  }
}
