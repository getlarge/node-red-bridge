const externalModules = (conf) => {
  const result = {};
  if (conf.nodeModules) {
    const modules = conf.nodeModules.split(',');
    modules.forEach((mod) => {
      const moduleName = mod.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      result[moduleName] = require(mod);
    });
  }
  return result;
};

export default externalModules;
