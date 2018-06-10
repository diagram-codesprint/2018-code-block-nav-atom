export default class EventEmitter {
  constructor() {
    this._subscriptions = {};
    this._id = 0;
  }
  on(name, callback) {
    if (!this._subscriptions[name]) {
      this._subscriptions[name] = {};
    }
    const id = this._id++;
    this._subscriptions[name][id] = callback;
    return {
      release() {
        delete this._subscriptions[name][id];
      }
    }
  }
  emit(name, ...args) {
    for (let callback of Object.values(this._subscriptions[name])) {
      callback(...args);
    }
  }
}
