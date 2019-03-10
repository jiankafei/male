import regeneratorRuntime from './regenerator';
import env from './env';
import {
  nul,
  dataDesc,
} from './util';

// 挂载 async function runtime
dataDesc(App, 'regeneratorRuntime', regeneratorRuntime);

// 挂载环境变量
dataDesc(App, 'env', nul());
for (const [key, val] of Object.entries(env)) {
  App.env[key] = val;
}

// Promise.prototype.finally
if (!Promise.prototype.finally) {
  dataDesc(Promise.prototype, 'finally', function(callback) {
    return this
      .then(res => this.constructor.resolve(callback()).then(() => res))
      .catch(err => this.constructor.resolve(callback()).then(() => { throw err }));
  });
}
