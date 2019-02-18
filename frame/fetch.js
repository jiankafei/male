import {
  nul,
  mergeOptions,
} from './util';

const regeneratorRuntime = App.regeneratorRuntime;

// 默认配置
const InnerOptions = {
  baseURL: '',
  data: nul(),
  header: nul(),
  method: 'GET',
  dataType: 'json',
  responseType: 'text',
  validateStatus: status => status >= 200 && status < 300 || status === 304,
};

// 请求方法
const fetch = ({
  baseURL,
  url,
  data,
  header,
  method,
  dataType,
  responseType,
  validateStatus,
}) => {
  let task = null;
  const p = new Promise((resolve, reject) => {
    task = wx.request({
      url: baseURL.replace(/\/$/, '') + url,
      data,
      method,
      dataType,
      responseType,
      header,
      success: res => {
        if (validateStatus(res.statusCode)) resolve(res);
        else reject(res);
      },
      fail: reject,
    });
  });
  p.task = task;
  return p;
};

// 拦截器
const wm_queue = new WeakMap();
class Wall {
  constructor() {
    wm_queue.set(this, new Set());
  }
  // 添加拦截器
  use(callback) {
    wm_queue.get(this).add(callback);
  }
  // 弹出拦截器
  eject(callback) {
    wm_queue.get(this).delete(callback);
  }
};

// 主程序
const FC = nul();
FC.defaults = nul();
FC.reqWall = new Wall();
FC.resWall = new Wall();

// 核心类
const wm_ins_options = new WeakMap();
class Core {
  constructor(options = nul()) {
    wm_ins_options.set(this, options);
    this.reqWall = new Wall();
    this.resWall = new Wall();
  }
  async fetch(options) {
    try {
      if (!options.url) throw new Error('url is required');
      options = mergeOptions(InnerOptions, FC.defaults, wm_ins_options.get(this), this.defaults, options);
      options.method = options.method.toUpperCase();
      const chain = [...wm_queue.get(FC.reqWall).values(), ...wm_queue.get(this.reqWall).values(), fetch, ...wm_queue.get(FC.resWall).values(), ...wm_queue.get(this.resWall).values()];
      let res = options;
      // 执行链条数组
      while (chain.length) {
        res = await chain.shift()(res);
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

const InnerInstance = new Core();
FC.fetch = InnerInstance.fetch.bind(InnerInstance);
FC.create = options => new Core(options);

for (const method of ['post', 'put', 'patch', 'delete', 'get', 'head', 'options']) {
  for (const obj of [Core.prototype, FC]) {
    obj[method] = function(url, data, options) {
      options.method = method;
      options.url = url;
      options.data = data;
      return this.fetch(options);
    };
  }
}

export default FC;
