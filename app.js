import Frame from './frame/index';
import config from './config';
import store from './store';

const Main = Frame({
  config,
  store,
  init() {
    console.log('%cInit', 'color: #0C84FF;');
    return Promise.resolve();
  },
});

Main({
  catchMethods(options) {
    console.log(options);
  },
});
