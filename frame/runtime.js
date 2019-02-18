import regeneratorRuntime from './regenerator';
App.regeneratorRuntime = regeneratorRuntime;

// Promise.prototype.finally
if (!Promise.prototype.finally) {
  Reflect.defineProperty(Promise.prototype, 'finally', {
    enumerable: true,
    value(callback) {
      return this
        .then(res => this.constructor.resolve(callback()).then(() => res))
        .catch(err => this.constructor.resolve(callback()).then(() => { throw err }));
    },
  });
}
