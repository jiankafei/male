import env from './env';
import {
  nil,
  dataDesc,
} from './util';

// 挂载环境变量
dataDesc(App, 'env', nil());
for (const [key, val] of Object.entries(env)) {
  App.env[key] = val;
}
