import regeneratorRuntime from './regenerator';
App.regeneratorRuntime = regeneratorRuntime;

// Promise.prototype.finally
if (typeof Promise.prototype.finally === 'function') {
  return;
}
Promise.prototype.finally = function (fn) {
  return this
    .then(res => this.constructor.resolve(fn()).then(() => res))
    .catch(err => this.constructor.resolve(fn()).then(() => { throw err }));
}