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

module.exports = {
  config
}