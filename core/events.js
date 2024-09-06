/**
 * Объект, содержащий события анимации.
 * @namespace
 * @property {string} PLAY - Событие начала анимации.
 * @property {string} STOP - Событие остановки анимации.
 * @property {string} BEGIN - Событие паузы анимации.
 * @property {string} PAUSE - Событие паузы анимации.
 * @property {string} UPDATE - Событие обновления анимации.
 * @property {string} REPEAT - Событие повторения анимации.
 * @property {string} REVERSE - Событие повторения анимации.
 * @property {string} COMPLETE - Событие завершения анимации.
 * @property {string} INTERRUPT - Событие завершения анимации.
 * @example
 * 
 * animation.on(EVENTS.complete, () => console.log('Анимация завершена'))
 * animation.once(EVENTS.complete, () => console.log('Анимация завершена'))
 * 
 * @see {@link Core}
 */
export const EVENTS = {
  PLAY: 'play',
  STOP: 'stop',
  BEGIN: 'begin',
  PAUSE: 'pause',
  UPDATE: 'update',
  REPEAT: 'repeat',
  REVERSE: 'reverse',
  COMPLETE: 'complete',
  INTERRUPT: 'interrupt',
}