import store from './store';
import {
  nul,
} from './util';

// 获取存储
const getStorage = function(key) {
  try {
    return wx.getStorageSync(key);
  } catch (err) {
    console.warn(err);
    return null;
  }
};
// 设置存储
const setStorage = function(key, data) {
  try {
    wx.setStorageSync(key, data);
  } catch (err) {
    console.warn(err);
  }
};
// 删除存储
const removeStorage = function(key) {
  try {
    wx.removeStorageSync(key);
  } catch (err) {
    console.warn(err);
  }
};
// 清空存储
const clearStorage = function() {
  try {
    wx.clearStorageSync();
  } catch (err) {
    console.warn(err);
  }
};
// 获取app存储key
const getKey = function(key) {
  return getStorage(App.process.APP_STORE_KEY)[key] || '';
};
// 设置app存储key
const setKey = function(key, val) {
  const oldStore = getStorage(App.process.APP_STORE_KEY) || nul();
  oldStore[key] = val;
  setStorage(App.process.APP_STORE_KEY, oldStore);
};
// 删除app存储key
const removeKey = function(key) {
  const oldStore = getStorage(App.process.APP_STORE_KEY) || nul();
  delete oldStore[key];
  setStorage(App.process.APP_STORE_KEY, oldStore);
};
// 获取session
const getSession = function() {
  return getKey('access_token');
};
// 设置session
const setSession = function(session) {
  setKey('access_token', session);
};
// 删除session
const removeSession = function() {
  removeKey('access_token');
};
// 检查session
// 只要存在 session 就代表 session 未过期，session过期机制由后端判断
const storeCheckSession = function() {
  return new Promise((resolve, reject) => {
    if (getSession()) {
      resolve();
    } else {
      reject({
        type: 'checkSession',
      });
    }
  });
};
// 检查session
// 基于 wx.checkSession 接口
const wxCheckSession = function() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: resolve,
      fail: () => {
        reject({
          type: 'checkSession',
        });
      },
    });
  });
};
// 检查session
const checkSession = function() {
  switch (App.process.CHECK_SESSION_TYPE) {
    case 'store':
      return storeCheckSession();
    case 'api':
      return wxCheckSession();
  }
};
// 更新App
const updateApp = function() {
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
const getUserInfo = function() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        store.userInfo = res.userInfo;
        resolve(res);
      },
      fail: () => {
        reject({
          type: 'getUserInfo',
        });
      },
    });
  });
};
// 查看某项授权
const checkAuth = function(name) {
  return new Promise((resolve, reject) => {
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
      fail: () => {
        reject({
          type: 'checkAuth',
        });
      },
    });
  });
};
// 获取设备信息
const getSystemInfo = function() {
  try {
    return wx.getSystemInfoSync();
  } catch (err) {
    console.warn(err);
    return nul();
  }
};
// 获取当前页面
const getPage = function() {
  const stack = getCurrentPages();
  return stack[stack.length - 1];
};
// 单位转换
const rpx2px = function(rpx) {
  return rpx / 750 * store.systemInfo.windowWidth;
};
// 登录到微信
const loginToWx = function() {
  console.log('%cLoginToWx', 'color: #0C84FF;');
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) resolve(res.code);
        else reject({
          type: 'loginToWx',
        });
      },
      fail: () => {
        reject({
          type: 'loginToWx',
        });
      },
    });
  });
};
// 登录到站点并设置session
const loginToSite = function(data) {
  console.log('%cLoginToSite', 'color: #0C84FF;');
  return new Promise((resolve, reject) => {
    wx.request({
      url: App.process.LOGIN_URL,
      method: 'POST',
      data,
      header: {
        Authorization: App.process.BASE_TOKEN,
      },
      success: res => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          setSession(res.data);
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
};

export default {
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
  getKey,
  setKey,
  removeKey,
  getSession,
  setSession,
  removeSession,
  storeCheckSession,
  wxCheckSession,
  checkSession,
  updateApp,
  getUserInfo,
  checkAuth,
  getSystemInfo,
  getPage,
  rpx2px,
  loginToWx,
  loginToSite,
};
