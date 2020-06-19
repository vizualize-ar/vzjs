var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()

app.use('/models', express.static('models'));
app.use('/dist', express.static('dist'));
app.use('/examples', express.static('examples'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const port = 5000;
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
  console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
})