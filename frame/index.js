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
import InnerConfig from './config';
import InnerStore from './store';

App.Page = Page;
App.Comp = Comp;
App.FC = FC;
App.DL = DL;
App.UL = UL;
App.WS = WS;

const Main = (options) => {
  App({
    ...Methods,
    authLogin,
    silentLogin,
    bothLogin,
    ...options,
    store: InnerStore,
  });
};

export default ({
  config,
  store,
  init = Promise.resolve,
  loginToSite = Methods.loginToSite,
}) => {
  Object.assign(InnerConfig, config);
  Object.assign(InnerStore, store);
  InnerStore.indexRoute = InnerConfig.INDEX_ROUTE;
  InnerStore.navBarMode = InnerConfig.NAV_BAR_MODE;
  App.init = init;
  App.loginToSite = loginToSite;
  App.ready = login(config.LOGIN_TYPE);
  App.ready.catch(console.warn);
  return Main;
};