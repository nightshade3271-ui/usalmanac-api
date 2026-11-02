const AlmanacEngine = require('../lib/almanacEngine.js');
const validateRapidApiSecret = require('../lib/auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, X-RapidAPI-Proxy-Secret');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!validateRapidApiSecret(req)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Unauthorized access',
      message: 'This endpoint must be accessed through RapidAPI Marketplace.',
      marketplace: 'https://rapidapi.com'
    }));
    return;
  }

  const query = req.query || {};
  const zip = query.zip || '45402';
  const date = query.date || null;

  try {
    const data = AlmanacEngine.getDailyAlmanac(zip, date);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      data
    }, null, 2));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Daily Almanac Lookup Failed', message: err.message }));
  }
};

