class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    // neu chua co event, thì khoi tao event rong
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

    return () => this.off(event, callback);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;

    // get all callbacks from eventListenr
    const callbacks = [...this.listeners.get(event)];

    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.log(`EventBus: Error in "${event}" handler`, error);
      }
    });
  }

  //   unsubcribe
  off(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }
    const callbacks = this.listeners.get(event);
    // find index in events
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length == 0) {
      this.listeners.delete(event);
    }
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };

    // dang ky event vơi wrapper callback
    this.on(event, wrapper);
  }

  clear(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      // remove all listeners
      this.listeners.clear();
    }
  }

  listenerCount(event) {
    if (event) {
      return this.listeners.has(event) ? this.listeners.get(event).length : 0;
    }

    let count = 0;
    this.listeners.forEach((callbacks) => (count += callbacks.length));
    return count;
  }
}

export default EventBus;
