import {
  nul,
} from './util';

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
  onResize,
  onPullDownRefresh,
  onReachBottom,
  onPageScroll,
  ...options,
}) => {
  const app = getApp();
  const innerOptions = nul();
  for (const name of ['onLoad', 'onShow']) {
    delete options[name];
  }
  for (const [key, val] of Object.entries(options)) {
    if (typeof val === 'function') {
      innerOptions[key] = function(event = nul()) {
        const result = val.call(this, event);
        typeof app.methodCaptured === 'function' && app.methodCaptured({
          is: this.is,
          name: key,
          event,
          result,
          instance: this,
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
        .then(res => {
          // console.log('Created');
          typeof onCreated === 'function' && onCreated.call(this, query, res);
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
            // console.log('ForwardShow');
            typeof onForward === 'function' && onForward.call(this, res);
          })
          .catch(console.warn);
      } else if (currentStackLength < stackLength) {
        // 返回
        // console.log('BackwardShow');
        typeof onBackward === 'function' && onBackward.call(this);
      } else if (currentStackLength === stackLength) {
        // 前后台切换
        // console.log('ReappearShow');
        typeof onReappear === 'function' && onReappear.call(this);
      }
      stackLength = currentStackLength;
    },
    onReady,
    onHide,
    onUnload,
    onResize,
    onPullDownRefresh,
    onReachBottom,
    onPageScroll,
    ...innerOptions,
  });
};