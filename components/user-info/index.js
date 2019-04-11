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
      app.checkAuth('userInfo')
        .catch(() => {
          this.setData({
            showUserInfoBtn: true,
          });
        });
    },
  },
  methods: {
    getUserInfo(ev) {
      if (this.getingUserInfo) return;
      this.getingUserInfo = true;
      const detail = ev.detail;
      this.triggerEvent('userinfo', detail);
      if (detail.errMsg === 'getUserInfo:ok') {
        this.triggerEvent('success', detail);
        app.store.userInfo = detail.userInfo;
        app.store.uid = detail.userInfo.id;
        App.ready = app.authLogin();
        App.ready
          .then(() => {
            this.setData({
              showUserInfoBtn: false,
            });
          })
          .catch(console.warn)
          .finally(() => {
            this.getingUserInfo = false;
          });
      } else {
        this.getingUserInfo = false;
        this.triggerEvent('fail', detail);
      }
    },
  },
});
