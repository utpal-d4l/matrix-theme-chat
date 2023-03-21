class EventEmitter {
  #events = {};

  addEventListener(eventName, handler) {
    this.#events[eventName] = handler;

    return () => delete this.#events[eventName];
  }

  emit(eventName, ...args) {
    this.#events[eventName](...args);
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
