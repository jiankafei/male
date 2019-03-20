import {
  nul,
  mergeOptions,
} from './util';
import Methods from './methods';

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
const fetch = function({
  url,
  baseURL,
  data,
  header,
  method,
  dataType,
  responseType,
  validateStatus,
}) {
  let task = null;
  let aborted = false; // 是否中断请求
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
      fail: err => {
        if (err.statusCode === 403 || err.statusCode === 401) {
          if (aborted) return reject(err);
          aborted = true;
          for (const task of this.tasks) {
            if (task.header.Authorization) {
              task.abort() // 中断请求
            }
          }
          wx.showLoading({
            title: '正在重新登录',
            mask: true,
          });
          Methods.removeSession();
          App.ready = login(App.env.LOGIN_TYPE);
          App.ready
            .then(() => {
              aborted = false;
              wx.hideLoading();
              wx.redirectTo({
                url: `/${getApp().getPage().route}`,
              });
            })
            .catch(console.warn);
        }
        reject(err);
      },
    });
  });
  task.header = header;
  this.tasks.push(task);
  return p;
};

// 拦截器
const wm_queue = new WeakMap();
class Wall {
  constructor() {
    wm_queue.set(this, new Set());
  }
  // 添加拦截器
  add(callback) {
    wm_queue.get(this).add(callback);
    return this;
  }
  // 弹出拦截器
  remove(callback) {
    wm_queue.get(this).delete(callback);
    return this;
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
    if (!options.url) throw new Error('url is required');
    options = mergeOptions(InnerOptions, FC.defaults, wm_ins_options.get(this), this.defaults, options);
    options.method = options.method.toUpperCase();
    const chain = [...wm_queue.get(FC.reqWall).values(), ...wm_queue.get(this.reqWall).values(), fetch, ...wm_queue.get(FC.resWall).values(), ...wm_queue.get(this.resWall).values()];
    let res = options;
    // 执行链条数组
    while (chain.length) {
      res = await chain.shift().call(this, res);
    }
    return res;
  }
};

const ins = new Core();
ins.tasks = [];
FC.fetch = ins.fetch.bind(ins);
FC.create = options => {
  const ins = new Core(options);
  ins.tasks = [];
  return ins;
};

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
