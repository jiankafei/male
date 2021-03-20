const app = getApp();

/**
 * @prop visibility // 外部控制授权按钮显示的字段，默认 true
 * @event userinfo // 点击授权按钮
 * @event success // 授权成功
 * @event fail // 授权失败
 */
App.Comp({
  options: {
    multipleSlots: true,
  },
  properties: {
    visibility: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    showUserInfoBtn: false,
  },
  lifetimes: {
    attached() {
      if (!App.env.HAS_USERINFO) {
        this.setData({
          showUserInfoBtn: true,
        });
      }
    },
  },
  methods: {
    async getUserProfile(ev) {
      try {
        if (this.gettingUserInfo) return;
        this.gettingUserInfo = true;
        this.triggerEvent('userinfo');
        const userInfo = await app.getUserProfile();
        this.triggerEvent('success', userInfo);
        app.store.userInfo = userInfo;
        App.ready = app.authLogin();
        await App.ready;
        this.setData({
          showUserInfoBtn: false,
        });
      } catch (error) {
        console.warn(error);
        if (error.type === 'getUserProfile') {
          this.triggerEvent('fail', error);
        }
      } finally {
        this.gettingUserInfo = false;
      }
    },
  },
});
