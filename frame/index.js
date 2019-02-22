import './runtime';
import Page from './page';
import Comp from './comp';
import FC from './fetch';
import {
  DL,
  UL,
  WS,
} from './network';
import Methods from './methods';
import {
  authLogin,
  silentLogin,
  bothLogin,
  login,
} from './login';
import InnerStore from './store';
import {
  dataDesc,
} from './util';

dataDesc(App, 'Page', Page);
dataDesc(App, 'Comp', Comp);
dataDesc(App, 'FC', FC);
dataDesc(App, 'DL', DL);
dataDesc(App, 'UL', UL);
dataDesc(App, 'WS', WS);

const Main = ({
  store,
  ...options,
}) => {
  App({
    ...Methods,
    authLogin,
    silentLogin,
    bothLogin,
    ...options,
    store: Object.assign(InnerStore, store),
  });
};

export default ({
  env,
  init = Promise.resolve,
  loginToSite = Methods.loginToSite,
}) => {
  for (const [key, val] of Object.entries(env)) {
    App.process[key] = val;
  }
  dataDesc(App, 'init', init);
  dataDesc(App, 'loginToSite', loginToSite);
  App.ready = login(App.process.LOGIN_TYPE);
  App.ready.catch(console.warn);
  return Main;
};