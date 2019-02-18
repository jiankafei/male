# 小程序框架的简单封装

  ！不允许修改 frame 文件夹里的文件

## App.ready - Promise

  1. 一个 Promise 实例，成功表示登录流程和初始信息加载流程完成；
  2. 一般不需要显式调用，新增的onCreated和onForward生命周期函数在内容使用该 Promise 实例

## Frame

  import Frame from './frame/index';
  用于初始化注入，并返回 Main 函数

  1. 注入 config，详见 config
  2. 注入 store，详见 store
  3. 注入 init 方法，非必填：
    App 登录之后需要执行的初始操作；
    一般可以在这里做初始信息加载等操作；
    每次启动app，该方法都会执行，如果没有登录，该方法会在登录后执行，并接收登录接口的结果作为参数；
    返回一个 Promise 实例；
  4. 注入登录到服务器 loginToSite 方法，非必填：
    返回一个 promise 实例；该方法会接收到一个参数：

    ```js
    data = {
      code,
      encrypted_data, // 授权后才会有
      iv, // 授权后才会有
    }
    ```

## Main

  对 App 函数的封装

### 添加的功能函数

  1. catchMethods
    page实例或component实例中任何函数的执行都会触发该函数的执行，并传递参数到该函数，不包含生命周期函数；
    该函数可以实现代码无侵入埋点等操作

    ```js
    options = {
      route, // page 里为 this.route comp 里为 this.is
      name, // 函数名
      event, // 事件对象
      result, // 函数执行的返回值
      scope, // page 或者 component 实例
    }
    ```

## App.Page - Method

  对 Page 函数的封装

### 删除的生命周期函数

  1. onLoad
  2. onShow

### 添加的生命周期函数：

  1. onCreated:
    替代 onLoad，小程序登陆流程和初始信息加载流程完毕后触发
  2. onAppear:
    替代 onShow，如果想有和onCreated一样的触发时机，则可以使用 App.ready 实例
  3. onForward:
    页面进入并显示时触发，但触发时机和 onCreated 一样
  4. onBackward:
    返回到当前页面并显示时触发
  5. onReappear:
    切换到后台又恢复显示时触发
  注：其他配置和原框架一致

## App.Comp - Method

  替代 Component 函数，组件需使用 lifetimes 字段来管理生命周期，因为在外部写的生命周期函数不会起作用

## Network

  以下方法都进行了 promisify 并且在 promise 实例上挂载了 task 对象

### App.FC - Object

  小程序请求接口的封装，用法类似 axios ；提供拦截器和默认设置等操作

  ```js
  const FC = App.FC;
  FC.defaults = {};
  // 拦截器支持链式调用
  FC.reqWall
    .add(callback)
    .remove(callback)
  FC.resWall
    .add(callback)
    .remove(callback)
  const ins = FC.create(defaults);
  ins.defaults = {}; // 会覆盖 create 方法里的 defaults
  ins.reqWall
    .add(callback)
    .remove(callback)
  ins.resWall
    .add(callback)
    .remove(callback)

  // 选项
  options = {
    baseURL: '',
    data: Object.create(null),
    header: Object.create(null),
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    validateStatus: status => status >= 200 && status < 300 || status === 304,
  };
  ```

### App.DL - Method

  小程序下载接口的封装

### App.UL - Method

  小程序上传接口的封装

### App.WS - Method

  小程序双工通讯接口的封装

## config

  ```js
  APP_STORE_KEY: '', // 存储app信息的 localStorege key
  BASE_TOKEN: '', // 基础 token
  LOGIN_URL: '',  // 登录到站点的url
  LOGIN_TYPE: '', // 登录类型 both_login | auth_login | silent_login 默认 both_login
  INDEX_ROUTE: '', // 主页路径，没有前置/，默认 pages/index/index
  CHECK_SESSION_TYPE: '', // 检测session的方式 api | store 默认 api
  NAV_BAR_MODE: '', // 自定义组件nav-bar模式 dark | light  默认 dark
  ```

## store

  app.store // 相当于 app.globalData

  默认有：

  ```js
  systemInfo, // wx.getSystemInfoSync 的结果
  navBarInfo, // 导航栏相关布局信息
  userInfo, // 默认为空对象
  indexRoute, // 来源于 config
  navBarMode, // 来源于 config
  ```

## runtime

  添加了以下内容的支持

    async function
    Promise.prototype.finally

  在需要使用 async 函数的文件里顶部添加如下代码：

  ```js
    const regeneratorRuntime = App.regeneratorRuntime;
  ```

## Login

  在 config 文件里配置登录类型，除 login 方法外的其他三个方法已挂载到 app 实例上

  1. authLogin: 授权登录，只有授权后才会调用登录流程，并获取用户微信信息
  2. silentLogin: 静默登录，不需要用户授权，执行静默登录
  3. bothLogin: 兼容登录，授权情况下，调用authLogin，没有授权，调用silentLogin
  4. login: 该方法在内部调用，做了是否登录的判断。通过 config 来配置登录方式 (both_login | auth_login | silent_login)，并默认调用 both_login

  注：在做授权登录时，如果需要自行调用上述三个登录函数，则需要按照下面的方式操作：

  ```js
    App.ready = app.authLogin();
    // or
    App.ready = app.silentLogin();
    // or
    App.ready = app.bothLogin();
    App.ready
      .then()
      .catch();
  ```

## Methods

  各种工具函数，已挂载到 app 实例上

  ```js
  // 对 wx.xxxSync 同步api的封装
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,

  getKey, // 获取app存储的某一个数据
  setKey, // 设置app存储的某一个数据
  removeKey, // 删除app存储的某一个数据

  getSession, // 获取 token
  setSession, // 设置token
  removeSession, // 删除token

  storeCheckSession, // 基于是否存储 token 判断是否过期
  wxCheckSession, // 基于 wx.checkSession 接口判断token是否过期
  checkSession, // 上两个方法的封装

  updateApp, // 更新app
  getSystemInfo, // 获取系统信息
  getPage, // 获取当前page
  rpx2px, // rpx 转换到 px

  getUserInfo, // promisify 'wx.getUserInfo' api
  checkAuth, // promisify 权限鉴定
  loginToWx, // promisify 登陆到 微信服务器
  loginToSite, // promisify 登陆到自家服务器
  ```

## 内部组件

  以下两个组件均已添加到全局组件

  nav-bar: 自定义导航组件

    @props title // 非必填，标题
    @props color // 非必填，标题颜色
    @props background // 非必填，导航栏背景
    @props fill // 非必填，是否占据空间
    @props back // 非必填，是否显示 back 按钮
    @props home // 非必填，是否显示 home 按钮
    @props mode // 非必填，按钮样式，dark | light

  user-info: 授权 getUserInfo 组件

    @props visibility // 非必填，外部控制是否显示
    @event userinfo // 点击授权按钮事件
    @event success // 授权成功事件
    @event fail // 授权失败事件

## 注意

  1. 登录流程和初始信息加载流程在 App 启动时，只会执行一次，因此除了初始显式的页面，其他页面的 onCreated 等有类似启动时机的周期函数将会很快被执行，因此无需担心新的周期函数会增加页面打开时间；
  2. 对于全局数据，建议只在app启动时调用一次获取接口，并把数据放到全局数据中，然后其他接口更新相关数据后，也一并更新全局数据即可，好处是不需要每个页面都要获取数据，加快页面显示；