export class Notifier {
  constructor() {
      this.events = {}
  }

  /**
   * Подписка на событие
   * @param {string} eventName - Название события
   * @param {function} listener - Функция обработчик события
   */
  on(eventName, listener) {
      if (!this.events[eventName]) {
          this.events[eventName] = []
      }
      this.events[eventName].push(listener)
  }

  /**
   * Отписка от события
   * @param {string} eventName - Название события
   * @param {function} listener - Функция обработчик события
   */
  off(eventName, listener) {
      if (!this.events[eventName]) return
      this.events[eventName] = this.events[eventName].filter(l => l !== listener)
  }

  /**
   * Генерация события
   * @param {string} eventName - Название события
   * @param  {...any} args - Аргументы, передаваемые обработчику события
   */
  emit(eventName, ...args) {
      if (!this.events[eventName]) return
      this.events[eventName].forEach(listener => listener(...args))
  }

  /**
   * Разовая подписка на событие
   * @param {string} eventName - Название события
   * @param {function} listener - Функция обработчик события
   */
  once(eventName, listener) {
      const onceListener = (...args) => {
          this.off(eventName, onceListener)
          listener(...args)
      }
      this.on(eventName, onceListener)
  }

  /**
   * Получить список обработчиков события
   * @param {string} eventName - Название события
   * @returns {function[]} Список обработчиков
   */
  getListeners(eventName) {
      return this.events[eventName] || []
  }

  /**
   * Получить количество обработчиков события
   * @param {string} eventName - Название события
   * @returns {number} Количество обработчиков
   */
  getListenerCount(eventName) {
      return this.events[eventName] ? this.events[eventName].length : 0
  }

  /**
   * Удаление всех подписок или подписок определенного типа
   * @param {string} [eventName] - Название события (опционально)
   */
  removeAllListeners(eventName) {
      if (eventName) {
          delete this.events[eventName]
      } else {
          this.events = {}
      }
  }

  /**
   * Получить список всех событий
   * @returns {string[]} Список названий событий
   */
  getEventNames() {
      return Object.keys(this.events)
  }

  /**
   * Проверить наличие подписчиков на событие
   * @param {string} eventName - Название события
   * @returns {boolean} True, если есть подписчики, иначе False
   */
  hasListeners(eventName) {
      return this.getListenerCount(eventName) > 0
  }
}