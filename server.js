const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).slice(1);
    const type = {
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      json: 'application/json'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const file = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
  serveFile(res, path.join(__dirname, 'public', file));
});

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

module.exports = server;
