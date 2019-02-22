let stackLength = 0;

export default ({
  onCreated,
  onAppear,
  onForward,
  onBackward,
  onReappear,
  onReady,
  onHide,
  onUnload,
  ...options,
}) => {
  const app = getApp();
  const innerOptions = Object.create(null);
  for (const name of ['onLoad', 'onShow']) {
    delete options[name];
  }
  for (const [key, val] of Object.entries(options)) {
    if (typeof val === 'function') {
      innerOptions[key] = function(event = Object.create(null)) {
        const result = val.call(this, event);
        typeof app.methodCaptured === 'function' && app.methodCaptured({
          route: this.route,
          name: key,
          event,
          result,
          scope: this,
        });
        return result;
      };
    } else {
      innerOptions[key] = val;
    }
  }
  Page({
    onLoad(query) {
      App.ready
        .then(() => {
          console.log('Created');
          typeof onCreated === 'function' && onCreated.call(this, query);
        })
        .catch(console.warn);
    },
    onShow() {
      const currentStackLength = getCurrentPages().length;
      // all
      typeof onAppear === 'function' && onAppear.call(this);
      // type
      if (currentStackLength > stackLength) {
        // 进入
        App.ready
          .then(res => {
            console.log('ForwardShow');
            typeof onForward === 'function' && onForward.call(this);
          })
          .catch(console.warn);
      } else if (currentStackLength < stackLength) {
        // 返回
        console.log('BackwardShow');
        typeof onBackward === 'function' && onBackward.call(this);
      } else if (currentStackLength === stackLength) {
        // 前后台切换
        console.log('ReappearShow');
        typeof onReappear === 'function' && onReappear.call(this);
      }
      stackLength = currentStackLength;
    },
    onReady,
    onHide,
    onUnload,
    ...innerOptions,
  });
};