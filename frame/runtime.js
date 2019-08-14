import env from './env';
import {
  nul,
  dataDesc,
} from './util';

// 挂载环境变量
dataDesc(App, 'env', nul());
for (const [key, val] of Object.entries(env)) {
  App.env[key] = val;
}
