import store from './store';
import {
  nil,
} from './util';

// querystring
const qs = {
  parse: (str) => {
    const obj = Object.create(null);
    for (const item of str.split('&')) {
      const [key, value] = item.split('=');
      obj[key] = value;
    }
    return obj;
  },
  stringify: (obj) => {
    const qslist = [];
    for (const [key, value] of Object.entries(obj)) {
      qslist.push(`${key}=${value}`);
    }
    return qslist.join('&');
  },
};

// 本地存储
const local = {
  get: (key) => {
    try {
      return wx.getStorageSync(key);
    } catch (err) {
      console.warn(err);
      return null;
    }
  },
  set: (key, data) => {
    try {
      wx.setStorageSync(key, data);
    } catch (err) {
      console.warn(err);
    }
  },
  remove: (key) => {
    try {
      wx.removeStorageSync(key);
    } catch (err) {
      console.warn(err);
    }
  },
  clear: () => {
    try {
      wx.clearStorageSync();
    } catch (err) {
      console.warn(err);
    }
  },
};

// 本地存储设置key
const localKey = {
  get: (key) => {
    local.get(App.env.STORE_KEY)[key] || '';
  },
  set: (key, val) => {
    const oldStore = local.get(App.env.STORE_KEY) || nil();
    oldStore[key] = val;
    local.set(App.env.STORE_KEY, oldStore);
  },
  remove: (key) => {
    const oldStore = local.get(App.env.STORE_KEY) || nil();
    delete oldStore[key];
    local.set(App.env.STORE_KEY, oldStore);
  },
};

// 本地存储设置session
const session = {
  get: () => localKey.get('access_token'),
  set: (str) => localKey.set('access_token', str),
  remove: () => localKey.remove('access_token'),
};

// 检查session
// 只要存在 session 就代表 session 未过期，session过期机制由后端判断
const storeCheckSession = () => new Promise((resolve, reject) => {
  if (session.get()) {
    resolve();
  } else {
    reject({
      type: 'checkSession',
    });
  }
});
// 检查session
// 基于 wx.checkSession 接口
const apiCheckSession = () => new Promise((resolve, reject) => {
  wx.checkSession({
    success: resolve,
    fail: (error) => {
      reject({
        type: 'checkSession',
        desc: error.errMsg,
      });
    },
  });
});
// 检查session
const checkSession = () => {
  switch (App.env.CHECK_SESSION_TYPE) {
    case 'store':
      return storeCheckSession();
    case 'api':
      return apiCheckSession();
  }
};
// 更新App
const updateApp = () => {
  if (wx.getUpdateManager) {
    const mng = wx.getUpdateManager();
    mng.onUpdateReady(() => {
      mng.applyUpdate();
    });
    mng.onUpdateFailed(() => {
      wx.showToast({
        title: '版本更新失败',
        icon: 'none',
      });
    });
  }
};
// 获取 UserInfo
const getUserProfile = (lang = 'zh_CN', desc = '该应用需要您的用户信息') => new Promise((resolve, reject) => {
  wx.getUserProfile({
    lang,
    desc,
    success: res => {
      if (res.errMsg === 'getUserProfile:ok') {
        store.userInfo = res.userInfo;
        resolve(res.userInfo);
      } else {
        reject({
          type: 'getUserProfile',
          desc = res.errMsg,
        });
      }
    },
    fail: (error) => {
      console.log(error);
      reject({
        type: 'getUserProfile',
        desc = error.errMsg,
      });
    },
  });
});
// 查看某项授权
const checkAuth = (name) => new Promise((resolve, reject) => {
  wx.getSetting({
    success: res => {
      if (res.authSetting[`scope.${name}`]) {
        resolve();
      } else {
        console.warn(`未授权 ${name}`);
        reject({
          type: 'checkAuth',
        });
      }
    },
    fail: (error) => {
      reject({
        type: 'checkAuth',
        desc: error.errMsg,
      });
    },
  });
});
// 获取设备信息
const getSystemInfo = () => {
  try {
    return wx.getSystemInfoSync();
  } catch (err) {
    console.warn(err);
    return nil();
  }
};
// 获取当前页面
const getPage = () => {
  const stack = getCurrentPages();
  return stack[stack.length - 1];
};
// 单位转换
const rpx2px = (rpx) => {
  return rpx / 750 * store.systemInfo.windowWidth;
};
// 登录到微信
const loginToWx = () => new Promise((resolve, reject) => {
  wx.login({
    success: res => {
      if (res.code) resolve(res.code);
      else reject({
        type: 'loginToWx',
      });
    },
    fail: (error) => {
      reject({
        type: 'loginToWx',
        desc: error.errMsg,
      });
    },
  });
});
// 登录到站点并设置session
const loginToSite = (data) => new Promise((resolve, reject) => {
  wx.request({
    url: App.env.LOGIN_URL,
    method: 'POST',
    data,
    header: {
      Authorization: App.env.BASE_TOKEN,
    },
    success: res => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        session.set(res.data);
        resolve(res);
      } else {
        res.type = 'loginToSite';
        reject(res);
      }
    },
    fail: () => {
      reject({
        type: 'loginToSite',
      });
    },
  });
});

export default {
  qs,
  local,
  localKey,
  session,
  storeCheckSession,
  apiCheckSession,
  checkSession,
  updateApp,
  getUserProfile,
  checkAuth,
  getSystemInfo,
  getPage,
  rpx2px,
  loginToWx,
  loginToSite,
};
