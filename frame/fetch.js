const nul = () => Object.create(null);
const mergeOptions = (...args) => {
  const options = nul();
  for (const item of args) {
    const { header, ...other } = item;
    Object.assign(options, other);
    Object.assign(options.header, header);
  }
  return options;
};

const FC = nul();
FC.defaults = nul();

// 默认配置
const InnerDefaults = {
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

// 核心类
const wm = new WeakMap();
class Core {
  constructor(InstanceDefaults = nul()) {
    wm.set(this, mergeOptions(InnerDefaults, FC.defaults, InstanceDefaults));
  }
  fetch(options) {
    if (!options.url) throw new Error('url is required');
    options = mergeOptions(wm.get(this), options);
    options.method = options.method.toUpperCase();
    return fetch(options);
  }
};

// FC 添加方法
const defaultInstance = new Core();
FC.fetch = defaultInstance.fetch.bind(defaultInstance);
FC.create = defaults => new Core(defaults);

// 添加其他方法
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
