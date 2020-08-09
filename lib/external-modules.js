const externalModules = (conf) => {
  if (conf.nodeModules) {
    const modules = conf.nodeModules.split(',');
    return modules.reduce((acc, mod) => {
      const moduleName = mod.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      acc[moduleName] = require(mod);
      return acc;
    }, {});
  }
  return {};
};

export default externalModules;
