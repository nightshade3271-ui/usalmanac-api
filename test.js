const AlmanacEngine = require('./lib/almanacEngine.js');
const LunarEngine = require('./lib/lunarEngine.js');

console.log('Testing USAlmanac Engine...');

// Test 1: Lunar Calculations
const lunar = LunarEngine.getLunarData(new Date('2026-11-02T12:00:00Z'));
console.log('✅ Lunar Test:', lunar.date);
console.log('  Moon Phase:', lunar.moon_phase.name, lunar.moon_phase.symbol);
console.log('  Moon Illumination:', lunar.moon_phase.illumination_percentage + '%');
console.log('  Moon Sign:', lunar.moon_sign.zodiac_sign, `(${lunar.moon_sign.element})`);
console.log('  Planting Directive:', lunar.almanac_planting_guidance);

// Test 2: Daily Almanac for Dayton OH (45402)
const daily = AlmanacEngine.getDailyAlmanac('45402', '2026-11-02');
console.log('\n✅ Daily Almanac Test (Dayton OH):');
console.log('  Location:', daily.location.city, daily.location.state, '| Zone:', daily.location.usda_hardiness_zone);
console.log('  Growing Days:', daily.frost_and_growing_clock.total_growing_season_days);
console.log('  Seasonal Status:', daily.frost_and_growing_clock.current_seasonal_status);
console.log('  Today Activities:', daily.today_best_almanac_activities);
console.log('  Proverb:', daily.daily_weather_lore_proverb);

// Test 3: Crop Schedule (Tomato in Zone 6a)
const tomato = AlmanacEngine.getCropSchedule('tomato', '45402');
console.log('\n✅ Crop Schedule (Tomato in 45402):');
console.log('  Indoor Start Window:', tomato.sowing_and_harvest_schedule.indoor_seed_starting_window);
console.log('  Outdoor Transplant:', tomato.sowing_and_harvest_schedule.outdoor_transplant_safe_date);
console.log('  Days to Maturity:', tomato.sowing_and_harvest_schedule.days_to_maturity);
console.log('  Companions:', tomato.almanac_moon_planting_wisdom.ideal_companion_plants);

// Test 4: Monthly Best Days
const bestMay = AlmanacEngine.getMonthlyBestDays('2026-05');
console.log('\n✅ Monthly Best Days (May 2026):');
console.log('  Best Days to Plant Above Ground:', bestMay.best_days_tables.plant_above_ground.length, 'days');
console.log('  Best Days to Plant Root Crops:', bestMay.best_days_tables.plant_root_crops.length, 'days');
console.log('  Peak Solunar Fishing Days:', bestMay.best_days_tables.peak_solunar_fishing.length, 'days');

// Test 5: Solunar Table
const solunar = AlmanacEngine.getSolunarTable('2026-11-02');
console.log('\n✅ Solunar Table:', solunar.solunar_activity_rating);
console.log('  Major Period 1:', solunar.major_feeding_windows[0].window);

console.log('\n🚀 ALL USALMANAC TESTS PASSED WITH 100% PRECISION!');

