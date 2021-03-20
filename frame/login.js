import Methods from './methods';
// 授权登录
const authLogin = async function() {
  if (!App.env.HAS_USERINFO) return;
  const code = await Methods.loginToWx();
  const { userInfo } = await Methods.getUserProfile();
  const res = await App.loginToSite({
    code,
    userInfo,
  });
  await App.init(res);
};

// 静默登录
const silentLogin = async function() {
  const code = await Methods.loginToWx();
  const res = await App.loginToSite({
    code,
  });
  await App.init(res);
};

// 兼容登录
const smartLogin = async function() {
  try {
    await authLogin();
  } catch (error) {
    if (error.type === 'checkAuth') {
      await silentLogin();
    } else {
      await Promise.reject(error);
    }
  }
};

// 登录流程
const login = async function(name = 'smart') {
  try {
    await Methods.checkSession();
    await App.init();
  } catch (error) {
    if (error.type === 'checkSession') {
      switch (name) {
        case 'smart':
          await smartLogin();
          break;
        case 'auth':
          await authLogin();
          break;
        case 'silent':
          await silentLogin();
          break;
      }
    }
  }
};

export {
  authLogin,
  silentLogin,
  smartLogin,
  login,
};