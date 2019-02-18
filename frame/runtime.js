import regeneratorRuntime from './regenerator';
App.regeneratorRuntime = regeneratorRuntime;

// Promise.prototype.finally
if (typeof Promise.prototype.finally === 'function') {
  return;
}
Reflect.defineProperty(Promise.prototype, 'finally', {
  enumerable: true,
  value(callback) {
    return this
      .then(res => this.constructor.resolve(callback()).then(() => res))
      .catch(err => this.constructor.resolve(callback()).then(() => { throw err }));
  },
});
