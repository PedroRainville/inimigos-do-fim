// Minimal shim for AsyncLocalStorage to satisfy browser builds.
export class AsyncLocalStorage {
  constructor() {
    this._store = undefined;
  }
  getStore() {
    return this._store;
  }
  run(store, callback, ...args) {
    const previous = this._store;
    try {
      this._store = store;
      return callback(...args);
    } finally {
      this._store = previous;
    }
  }
  enterWith(store) {
    this._store = store;
  }
}
