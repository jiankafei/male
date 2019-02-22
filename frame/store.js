import {
  nul,
} from './util';

// 计算导航栏布局
const getNavBarInfo = function(systemInfo) {
  const offset = /ios/i.test(systemInfo.system) ? 7 : 9;
  const statusBarHeight = systemInfo.statusBarHeight;
  const menuWidth = 87;
  const menuHeight = 30;
  const menuTop = statusBarHeight + offset;
  const menuRight = 12;
  const navBarHeight = menuHeight + menuTop + offset;
  const navBarPadding = `${menuTop}px ${menuRight}px ${offset}px`;
  return {
    menuWidth,
    menuHeight,
    menuTop,
    menuRight,
    statusBarHeight,
    navBarHeight,
    navBarPadding,
    offset, // statusBar 和 menu 的间隔距离
  };
};

const systemInfo = (() => {
  try {
    return wx.getSystemInfoSync();
  } catch (error) {
    console.warn(error);
  }
})();
const navBarInfo = getNavBarInfo(systemInfo);

export default {
  systemInfo,
  navBarInfo,
  userInfo: nul(),
};
