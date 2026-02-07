/**
 * Mỗi event gôm (eventName, [callbacks..]), vì thế dùng map() sẽ rất tiện
 */

export class EventEmiiter {
  #events; //private variable
  constructor() {
    this.#events = new Map();
  }

  //   dang ky event, va callback cho event do
  on(event, callback) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(callback);
  }

  /**
   *
   * @param {string} event  - event name
   * @param {*} data - data passing to callbacks
   */

  emit(event, data) {
    // ban chat cua emit event la goi callback(data)
    const callbacks = this.#events.get(event);
    callbacks.forEach((cb) => {
      cb(data);
    });
  }

  //   unsubcripe events, remove event from data
  off(event, callback) {
    const callbacks = this.#events.get(event);
    if (callbacks) {
      this.#events.set(
        event,
        callbacks.filter((cb) => cb != callback),
      );
    }
  }
}
