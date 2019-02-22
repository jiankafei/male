// 空对象
const nul = () => Object.create(null);

// 合并请求参数
const mergeOptions = (...args) => {
  const options = nul();
  for (const item of args) {
    const { header, ...other } = item;
    Object.assign(options, other);
    Object.assign(options.header, header);
  }
  return options;
};


// 定义数据描述符
const dataDesc = (target, prop, value) => {
  if (!Reflect.defineProperty(target, prop, {
    enumerable: true,
    value,
  })) {
    console.warn(`${target} try to define a Data Descriptor "${prop}", but failed`);
  }
};

// 定义存取描述符
const accessDesc = (target, prop, get, set) => {
  if (!Reflect.defineProperty(target, prop, {
    enumerable: true,
    get,
    set,
  })) {
    console.warn(`${target} try to define a Access Descriptor "${prop}", but failed`);
  }
};

export {
  nul,
  mergeOptions,
  dataDesc,
  accessDesc,
};