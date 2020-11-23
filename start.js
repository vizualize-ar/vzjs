const ngrok = require('ngrok');
(async function() {
  try {
    const url = await ngrok.connect({
      addr: 'https://localhost:7000'
    });
    const child = await require('child_process').spawn('npm start -- --proxy=' + url, { shell: true });
    for await (const data of child.stdout) {
      console.log(`stdout from the child: ${data}`);
    };
  } catch (e) {
    console.error('Problem starting proxy', e);
  }
})();