import './runtime';
import Page from './page';
import Comp from './comp';
import Methods from './methods';
import Network from './network';
import {
  authLogin,
  silentLogin,
  bothLogin,
  login,
} from './login';
import InnerConfig from './config';
import InnerStore from './store';

const Main = (options) => {
  App({
    ...Methods,
    ...Network,
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
  App.Page = Page;
  App.Comp = Comp;
  App.ready = login(config.LOGIN_TYPE);
  App.ready.catch(console.warn);
  return Main;
};