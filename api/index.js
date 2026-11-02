module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    service: 'USAlmanac API',
    status: 'operational',
    version: '1.0.0',
    description: 'Digital Farmer\'s Almanac API — Lunar Planting Calendars, USDA Frost Clocks, Solunar Tables & Daily Weather Folklore',
    endpoints: {
      dailyAlmanac: 'GET /v1/almanac/daily?zip=45402',
      bestDays: 'GET /v1/almanac/best-days?month=2026-05',
      lunarPhase: 'GET /v1/almanac/lunar?date=2026-11-02',
      frostClock: 'GET /v1/almanac/frost?zip=45402',
      cropSchedule: 'GET /v1/almanac/crops?crop=tomato&zip=45402',
      solunarTables: 'GET /v1/almanac/solunar?date=2026-11-02',
      sandbox: 'GET /api/sandbox?zip=45402&crop=tomato'
    },
    documentation: 'https://usalmanac-api.vercel.app',
    marketplace: 'https://rapidapi.com'
  }, null, 2));
};

