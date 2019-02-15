import './runtime';
import Page from './page';
import Comp from './comp';
import Methods from './methods';
import {
  authLogin,
  silentLogin,
  bothLogin,
  login,
} from './login';
import innerConfig from './config';
import innerStore from './store';

const Main = (options) => {
  App({
    ...Methods,
    authLogin,
    silentLogin,
    bothLogin,
    ...options,
    store: innerStore,
  });
};

export default ({
  config,
  store,
  init = Promise.resolve,
  loginToSite = Methods.loginToSite,
}) => {
  Object.assign(innerConfig, config);
  Object.assign(innerStore, store);
  innerStore.indexRoute = innerConfig.INDEX_ROUTE;
  innerStore.navBarMode = innerConfig.NAV_BAR_MODE;
  App.init = init;
  App.loginToSite = loginToSite;
  App.Page = Page;
  App.Comp = Comp;
  App.ready = login(config.LOGIN_TYPE);
  App.ready.catch(console.warn);
  return Main;
};