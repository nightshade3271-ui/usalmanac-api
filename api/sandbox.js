const AlmanacEngine = require('../lib/almanacEngine.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const query = req.method === 'POST' ? (req.body || {}) : (req.query || {});
  const zip = query.zip || '45402';
  const crop = query.crop || 'tomato';
  const date = query.date || null;

  try {
    const daily = AlmanacEngine.getDailyAlmanac(zip, date);
    const cropData = AlmanacEngine.getCropSchedule(crop, zip);
    const solunar = AlmanacEngine.getSolunarTable(date);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: true,
      sandbox: true,
      notice: 'Compiled via free developer sandbox. For production volume and automated crop schedules, subscribe on RapidAPI.',
      daily_almanac: daily,
      selected_crop_schedule: cropData,
      solunar_feeding_forecast: solunar
    }, null, 2));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Sandbox Query Failed', message: err.message }));
  }
};
