const ngrok = require('ngrok');
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

(async function() {
  try {
    console.log("Using proxy callback url", config.proxyApiUrl)
    const url = await ngrok.connect({
      addr: config.proxyApiUrl
    });
    const child = await require('child_process').spawn(`cross-env proxy=${url} yarn start`, { shell: true });
    for await (const data of child.stdout) {
      console.log(`stdout from the child: ${data}`);
    };
  } catch (e) {
    console.error('Problem starting proxy', e);
  }
})();