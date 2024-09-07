export class Notifier {
    constructor() {
        this.events = {}
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {function} listener - Event handler function
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }
        this.events[eventName].push(listener)
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {function} listener - Event handler function
     */
    off(eventName, listener) {
        if (!this.events[eventName]) return
        this.events[eventName] = this.events[eventName].filter(l => l !== listener)
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param  {...any} args - Arguments passed to the event handler
     */
    emit(eventName, ...args) {
        if (!this.events[eventName]) return
        this.events[eventName].forEach(listener => listener(...args))
    }

    /**
     * Subscribe to an event once
     * @param {string} eventName - Name of the event
     * @param {function} listener - Event handler function
     */
    once(eventName, listener) {
        const onceListener = (...args) => {
            this.off(eventName, onceListener)
            listener(...args)
        }
        this.on(eventName, onceListener)
    }

    /**
     * Get the list of event listeners
     * @param {string} eventName - Name of the event
     * @returns {function[]} List of event handlers
     */
    getListeners(eventName) {
        return this.events[eventName] || []
    }

    /**
     * Get the number of event listeners
     * @param {string} eventName - Name of the event
     * @returns {number} Number of event listeners
     */
    getListenerCount(eventName) {
        return this.events[eventName] ? this.events[eventName].length : 0
    }

    /**
     * Remove all listeners or listeners of a specific event type
     * @param {string} [eventName] - Name of the event (optional)
     */
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.events[eventName]
        } else {
            this.events = {}
        }
    }

    /**
     * Get the list of all event names
     * @returns {string[]} List of event names
     */
    getEventNames() {
        return Object.keys(this.events)
    }

    /**
     * Check if there are any listeners for an event
     * @param {string} eventName - Name of the event
     * @returns {boolean} True if there are listeners, otherwise False
     */
    hasListeners(eventName) {
        return this.getListenerCount(eventName) > 0
    }
}
