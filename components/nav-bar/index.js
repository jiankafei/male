const app = getApp();

const { navBarInfo } = app.store;

App.Comp({
  options: {
    addGlobalClass: true,
  },
  properties: {
    // 标题
    title: {
      type: String,
      value: '',
    },
    // 标题颜色
    color: {
      type: String,
      value: '#fff',
    },
    // 背景色
    background: {
      type: String,
      value: 'transparent',
    },
    // 是否占位
    fill: {
      type: Boolean,
      value: true,
    },
    // 是否需要back按钮
    back: {
      type: Boolean,
      value: true,
    },
    // 是否需要home按钮
    home: {
      type: Boolean,
      value: false,
    },
    // 按钮图标样式
    mode: String, // dark | light
  },
  data: {
    top: navBarInfo.menuTop,
    left: navBarInfo.menuRight,
    height: navBarInfo.navBarHeight,
    homeNav: false,
    backNav: false,
    iconStyle: 'dark', // 默认 dark
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      if (pages.length === 1) {
        this.setData({
          iconStyle: this.data.mode || App.env.NAV_BAR_MODE,
          backNav: false,
          homeNav: pages[pages.length - 1].route === App.env.INDEX_ROUTE ? false : true,
        });
      } else {
        this.setData({
          iconStyle: this.data.mode || App.env.NAV_BAR_MODE,
          backNav: true && this.data.back,
          homeNav: false || this.data.home,
        });
      }
    },
  },
  methods: {
    navBack() {
      wx.navigateBack();
    },
    navHome() {
      wx.reLaunch({
        url: `/${App.env.INDEX_ROUTE}`,
      });
    },
  },
});
