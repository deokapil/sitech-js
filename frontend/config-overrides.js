module.exports = function override(config, env) {
  let loaders = config.resolve;
  loaders.fallback = {
    buffer: require.resolve("buffer"),
  };

  return config;
};
