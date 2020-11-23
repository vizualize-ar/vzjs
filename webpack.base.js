const rc = require('rc');
var config = null;
if (process.env.NODE_ENV === 'development') {
  config = rc('vzjs-');
} else {
  config = rc(`vzjs-${process.env.NODE_ENV}-`);
  if (config.mode === 'staging') {
    config = rc('vzjs-staging-');
  }
}
delete config._;
delete config.config;
delete config.configs;

// Passed from start.js. This is the proxy url from the ngrok.io service used to avoid https CA errors in browser
if (config.proxy) {
  console.log("Changing API url to proxy ", config.proxy);
  config.apiUrl = config.proxy;
}

module.exports = {
  config
}