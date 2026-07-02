// Minimal static file server to serve the project root from the backend folder
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = process.env.PORT || 3000;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.txt':  'text/plain; charset=utf-8'
  };
  return map[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  try {
    const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
    let safePath = path.normalize(decodedUrl).replace(/^([\\.\\.\\/\\\\])+/, '');
    let filePath = path.join(root, safePath);

    // If request ends with slash or is a directory, serve index.html
    if (decodedUrl === '/' || decodedUrl === '') {
      filePath = path.join(root, 'index.html');
    }

    // Protect against path traversal
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (er, data) => {
        if (er) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }
        res.setHeader('Content-Type', contentType(filePath));
        res.end(data);
      });
    });
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Static server serving ${root} on http://localhost:${port}`);
});
