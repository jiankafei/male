const nul = () => Object.create(null);

const mergeOptions = (...args) => {
  const options = nul();
  for (const item of args) {
    const { header, ...other } = item;
    Object.assign(options, other);
    Object.assign(options.header, header);
  }
  return options;
};

export {
  nul,
  mergeOptions,
};