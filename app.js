import Frame from './frame/index';
import env from './env';

const Main = Frame({
  env,
  init() {
    console.log('%cInit', 'color: #0C84FF;');
    return Promise.resolve();
  },
});

Main({
  methodCaptured(options) {
    console.log(options);
  },
});
