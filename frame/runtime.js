import regeneratorRuntime from './regenerator';
import env from './env';

// 挂载 async function runtime
App.regeneratorRuntime = regeneratorRuntime;

// 挂载环境变量
for (const [key, val] of Object.entries(env)) {
  App.process[key] = val;
}

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
