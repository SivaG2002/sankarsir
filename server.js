const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDirectory = __dirname;
const dataDirectory = path.join(rootDirectory, 'data');
const counterFile = path.join(dataDirectory, 'page-visits.json');
const port = Number(process.env.PORT) || 3000;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
  });
  response.end(JSON.stringify(data));
}

function getVisitCount() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  try {
    const data = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
    return Math.max(0, Number(data.count) || 0);
  } catch {
    return 0;
  }
}

function saveVisitCount(count) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(counterFile, JSON.stringify({ count }, null, 2));
}

function serveStaticFile(request, response, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(rootDirectory, `.${requestedPath}`);

  if (!filePath.startsWith(`${rootDirectory}${path.sep}`) || requestedPath.startsWith('/data/')) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end(error.code === 'ENOENT' ? 'Page not found' : 'Server error');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'application/octet-stream' });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === '/api/visits') {
    if (request.method !== 'GET' && request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method not allowed.' });
      return;
    }

    try {
      let count = getVisitCount();
      if (request.method === 'POST') {
        count += 1;
        saveVisitCount(count);
      }
      sendJson(response, 200, { count });
    } catch {
      sendJson(response, 500, { error: 'Could not save the visit count.' });
    }
    return;
  }

  serveStaticFile(request, response, decodeURIComponent(url.pathname));
});

server.listen(port, () => {
  console.log(`sankar is running at http://localhost:${port}`);
});
