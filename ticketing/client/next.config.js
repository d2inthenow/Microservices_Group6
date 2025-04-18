module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 1000; // Check for changes every second
    return config;
  },
};
