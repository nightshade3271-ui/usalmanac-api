const http = require('http');
const fs = require('fs');
const path = require('path');

const dailyHandler = require('./api/daily.js');
const bestDaysHandler = require('./api/bestDays.js');
const lunarHandler = require('./api/lunar.js');
const frostHandler = require('./api/frost.js');
const cropsHandler = require('./api/crops.js');
const solunarHandler = require('./api/solunar.js');
const sandboxHandler = require('./api/sandbox.js');
const indexHandler = require('./api/index.js');

const PORT = process.env.PORT || 3009;

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = Object.fromEntries(reqUrl.searchParams.entries());
  const pathname = reqUrl.pathname;

  // Buffer incoming JSON body for POST
  if (req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });
    await new Promise(resolve => req.on('end', resolve));
    try {
      req.body = bodyStr ? JSON.parse(bodyStr) : {};
    } catch (e) {
      req.body = bodyStr;
    }
  }

  // Routing
  if (pathname === '/v1/almanac/daily' || pathname === '/api/daily') {
    return dailyHandler(req, res);
  }
  if (pathname === '/v1/almanac/best-days' || pathname === '/api/bestDays') {
    return bestDaysHandler(req, res);
  }
  if (pathname === '/v1/almanac/lunar' || pathname === '/api/lunar') {
    return lunarHandler(req, res);
  }
  if (pathname === '/v1/almanac/frost' || pathname === '/api/frost') {
    return frostHandler(req, res);
  }
  if (pathname === '/v1/almanac/crops' || pathname === '/api/crops') {
    return cropsHandler(req, res);
  }
  if (pathname === '/v1/almanac/solunar' || pathname === '/api/solunar') {
    return solunarHandler(req, res);
  }
  if (pathname === '/api/sandbox') {
    return sandboxHandler(req, res);
  }
  if (pathname === '/v1/status' || pathname === '/api/status') {
    return indexHandler(req, res);
  }

  // Static files in public/
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 USAlmanac API Server running at http://localhost:${PORT}`);
});

