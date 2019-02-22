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

App.Page = Page;
App.Comp = Comp;
App.FC = FC;
App.DL = DL;
App.UL = UL;
App.WS = WS;

const Main = (store, ...options) => {
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
  App.init = init;
  App.loginToSite = loginToSite;
  App.ready = login(config.LOGIN_TYPE);
  App.ready.catch(console.warn);
  return Main;
};