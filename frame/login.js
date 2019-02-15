import Methods from './methods';
const regeneratorRuntime = App.regeneratorRuntime;

// 授权登录
const authLogin = async function() {
  await Methods.checkAuth('userInfo');
  const code = await Methods.loginToWx();
  const { encryptedData: encrypted_data, iv } = await Methods.getUserInfo();
  const res = await App.loginToSite({
    code,
    encrypted_data,
    iv,
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
const bothLogin = async function() {
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
const login = async function(name = 'both_login') {
  try {
    await Methods.checkSession();
    await App.init();
  } catch (error) {
    if (error.type === 'checkSession') {
      switch (name) {
        case 'both_login':
          await bothLogin();
          break;
        case 'auth_login':
          await authLogin();
          break;
        case 'silent_login':
          await silentLogin();
          break;
      }
    }
  }
};

export {
  authLogin,
  silentLogin,
  bothLogin,
  login,
};