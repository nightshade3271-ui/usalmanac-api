const LunarEngine = require('./lunarEngine.js');
const usdaZones = require('./data/usdaZones.json');
const cropCatalog = require('./data/cropCatalog.json');
const proverbs = require('./data/proverbs.json');

function resolveZipZone(zipInput) {
  const clean = String(zipInput || '').trim();
  if (clean.length < 3) return null;
  const prefix = clean.substring(0, 3);
  const regional = usdaZones.regional_prefix_map[prefix];
  if (regional) {
    const zoneDef = usdaZones.zone_definitions[regional.zone] || usdaZones.zone_definitions['6a'];
    return {
      zip: clean,
      state: regional.state,
      city: regional.city,
      usda_zone: regional.zone,
      ...zoneDef
    };
  }

  // Fallback to average US temperate zone 6b
  return {
    zip: clean,
    state: 'US',
    city: 'Temperate Region',
    usda_zone: '6b',
    ...usdaZones.zone_definitions['6b']
  };
}

const AlmanacEngine = {
  getDailyAlmanac(zip = '45402', dateStr = null) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const lunar = LunarEngine.getLunarData(targetDate);
    const climate = resolveZipZone(zip);

    // Pick deterministic daily proverb based on day of year
    const startOfYear = new Date(targetDate.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((targetDate - startOfYear) / (1000 * 60 * 60 * 24));
    const proverb = proverbs[dayOfYear % proverbs.length];

    // Compute frost clock status
    const currentYear = targetDate.getFullYear();
    const springFrostThisYear = new Date(`${currentYear}-${climate.spring_frost}`);
    const fallFrostThisYear = new Date(`${currentYear}-${climate.fall_frost}`);

    let frostStatus = 'Active Growing Season';
    let daysToFrost = 0;

    if (climate.spring_frost === 'Frost Free') {
      frostStatus = 'Year-Round Tropical Growing Zone (Frost Free)';
    } else if (targetDate < springFrostThisYear) {
      frostStatus = 'Pre-Season Dormancy / Indoor Seed Starting Window';
      daysToFrost = Math.ceil((springFrostThisYear - targetDate) / (1000 * 60 * 60 * 24));
    } else if (targetDate >= springFrostThisYear && targetDate < fallFrostThisYear) {
      frostStatus = 'Active Frost-Free Growing Window';
      daysToFrost = Math.ceil((fallFrostThisYear - targetDate) / (1000 * 60 * 60 * 24));
    } else {
      frostStatus = 'Post-Frost Autumn Harvest & Soil Rest Window';
    }

    // Daily Best Activity Scorecard
    const isWaxing = lunar.moon_phase.category.includes('Waxing');
    const isFertile = lunar.moon_sign.element === 'Water' || lunar.moon_sign.element === 'Earth';

    const bestActivitiesToday = [];
    if (isWaxing && isFertile) {
      bestActivitiesToday.push('Plant Above-Ground Crops (Tomatoes, Corn, Leafy Greens)');
      bestActivitiesToday.push('Sow Flower Seeds & Herbs');
      bestActivitiesToday.push('Graft Fruit Trees & Irrigate Deeply');
    } else if (!isWaxing && isFertile) {
      bestActivitiesToday.push('Plant Root Vegetables (Potatoes, Carrots, Beets, Onions)');
      bestActivitiesToday.push('Set Bulbs and Transplants');
      bestActivitiesToday.push('Divide Perennials');
    } else if (!isWaxing && !isFertile) {
      bestActivitiesToday.push('Cultivate Soil & Eradicate Weeds');
      bestActivitiesToday.push('Harvest Grains & Vegetables for Long-Term Storage');
      bestActivitiesToday.push('Prune Trees to Retard Growth');
      bestActivitiesToday.push('Fell Timber & Split Firewood');
    } else {
      bestActivitiesToday.push('Weed & Till Soil');
      bestActivitiesToday.push('Prepare Garden Beds & Turn Compost');
      bestActivitiesToday.push('Harvest Seeds for Next Season');
    }

    return {
      almanac_edition: `Farmer's Almanac Digital Daily • ${targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      location: {
        zip: climate.zip,
        city: climate.city,
        state: climate.state,
        usda_hardiness_zone: climate.usda_zone,
        winter_extreme_temp: climate.temp_range
      },
      astronomical_lunar_state: lunar,
      frost_and_growing_clock: {
        last_spring_frost_date: climate.spring_frost,
        first_fall_frost_date: climate.fall_frost,
        total_growing_season_days: climate.growing_days,
        current_seasonal_status: frostStatus,
        days_until_next_frost_milestone: daysToFrost
      },
      today_best_almanac_activities: bestActivitiesToday,
      daily_weather_lore_proverb: `"${proverb}"`
    };
  },

  getMonthlyBestDays(yearMonth = null) {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth(); // 0-indexed

    if (yearMonth && /^\d{4}-\d{2}$/.test(yearMonth)) {
      const parts = yearMonth.split('-');
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bestDays = {
      plant_above_ground: [],
      plant_root_crops: [],
      harvest_and_preserve: [],
      weed_and_prune_growth: [],
      peak_solunar_fishing: [],
      set_eggs_and_breed: []
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(Date.UTC(year, month, day, 12, 0, 0));
      const lunar = LunarEngine.getLunarData(d);
      const isWaxing = lunar.moon_phase.category.includes('Waxing');
      const elem = lunar.moon_sign.element;
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Above ground: Waxing + Water/Earth
      if (isWaxing && (elem === 'Water' || elem === 'Earth')) {
        bestDays.plant_above_ground.push(dateString);
      }
      // Root crops: Waning + Earth/Water
      if (!isWaxing && (elem === 'Earth' || elem === 'Water')) {
        bestDays.plant_root_crops.push(dateString);
      }
      // Harvest: Barren Fire/Air signs
      if (elem === 'Fire' || elem === 'Air') {
        bestDays.harvest_and_preserve.push(dateString);
      }
      // Weeding: Waning + Fire
      if (!isWaxing && elem === 'Fire') {
        bestDays.weed_and_prune_growth.push(dateString);
      }
      // Solunar fishing: New Moon and Full Moon windows (+/- 2 days)
      if (lunar.moon_phase.illumination_percentage > 90 || lunar.moon_phase.illumination_percentage < 10) {
        bestDays.peak_solunar_fishing.push(dateString);
      }
      // Breeding: Waxing in fertile signs
      if (isWaxing && elem === 'Water') {
        bestDays.set_eggs_and_breed.push(dateString);
      }
    }

    return {
      month: `${year}-${String(month + 1).padStart(2, '0')}`,
      month_name: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      best_days_tables: bestDays
    };
  },

  getCropSchedule(cropQuery = 'tomato', zip = '45402') {
    const climate = resolveZipZone(zip);
    const cropId = String(cropQuery).toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const crop = cropCatalog.find(c => c.id.includes(cropId) || c.name.toLowerCase().includes(cropQuery.toLowerCase())) || cropCatalog[0];

    const currentYear = new Date().getFullYear();
    const springFrost = new Date(`${currentYear}-${climate.spring_frost}`);

    // Compute indoor seed start date
    const indoorStart = new Date(springFrost.getTime() - (crop.indoor_seed_weeks_before_frost * 7 * 24 * 60 * 60 * 1000));
    // Compute outdoor transplant date
    const outdoorTransplant = new Date(springFrost.getTime() + (crop.transplant_weeks_after_frost * 7 * 24 * 60 * 60 * 1000));
    // Approximate harvest date
    const harvestDate = new Date(outdoorTransplant.getTime() + (crop.days_to_maturity * 24 * 60 * 60 * 1000));

    return {
      crop_name: crop.name,
      category: crop.category,
      usda_location: {
        zip: climate.zip,
        city: climate.city,
        state: climate.state,
        usda_zone: climate.usda_zone,
        last_spring_frost: climate.spring_frost
      },
      sowing_and_harvest_schedule: {
        indoor_seed_starting_window: crop.indoor_seed_weeks_before_frost > 0 ? indoorStart.toISOString().split('T')[0] : 'Direct Sow Outdoors (No indoor start needed)',
        outdoor_transplant_safe_date: outdoorTransplant.toISOString().split('T')[0],
        estimated_first_harvest_date: harvestDate.toISOString().split('T')[0],
        days_to_maturity: crop.days_to_maturity
      },
      almanac_moon_planting_wisdom: {
        traditional_rule: crop.lunar_rule,
        sun_requirement: crop.sun_requirement,
        min_soil_temperature: `${crop.min_soil_temp_f}°F`,
        ideal_companion_plants: crop.companion_plants,
        antagonistic_avoid_plants: crop.antagonistic_plants
      }
    };
  },

  getSolunarTable(dateStr = null) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const lunar = LunarEngine.getLunarData(targetDate);

    // Traditional Solunar Theory:
    // Major feeding periods occur when the Moon is overhead (upper transit) and underfoot (lower transit) ~2 hrs each.
    // Minor feeding periods occur at moonrise and moonset ~1 hr each.
    const age = lunar.moon_phase.age_in_days;
    // Approximate moon transit hour = (moon_age * 0.8) hours past noon
    const transitHour = (12 + (age * 0.8)) % 24;
    const underfootHour = (transitHour + 12) % 24;

    function formatTime(h) {
      const whole = Math.floor(h);
      const min = Math.round((h - whole) * 60);
      const ampm = whole >= 12 ? 'PM' : 'AM';
      const h12 = whole % 12 || 12;
      return `${h12}:${String(min).padStart(2, '0')} ${ampm}`;
    }

    let rating = 'Average Activity';
    if (lunar.moon_phase.illumination_percentage > 92 || lunar.moon_phase.illumination_percentage < 8) {
      rating = '⭐⭐⭐⭐⭐ PEAK SOLUNAR FEEDING (New/Full Moon Max Draw)';
    } else if (lunar.moon_phase.illumination_percentage > 45 && lunar.moon_phase.illumination_percentage < 55) {
      rating = '⭐⭐⭐ MODERATE ACTIVITY (Quarter Moon)';
    }

    return {
      date: targetDate.toISOString().split('T')[0],
      moon_phase: lunar.moon_phase.name,
      illumination: `${lunar.moon_phase.illumination_percentage}%`,
      solunar_activity_rating: rating,
      major_feeding_windows: [
        { period: 'Major Period 1 (Moon Overhead)', window: `${formatTime(transitHour - 1)} – ${formatTime(transitHour + 1)}` },
        { period: 'Major Period 2 (Moon Underfoot)', window: `${formatTime(underfootHour - 1)} – ${formatTime(underfootHour + 1)}` }
      ],
      minor_feeding_windows: [
        { period: 'Minor Period 1 (Moonrise)', window: `${formatTime((transitHour + 6) % 24 - 0.5)} – ${formatTime((transitHour + 6) % 24 + 0.5)}` },
        { period: 'Minor Period 2 (Moonset)', window: `${formatTime((transitHour + 18) % 24 - 0.5)} – ${formatTime((transitHour + 18) % 24 + 0.5)}` }
      ],
      traditional_fisherman_lore: 'Game and fish feed most aggressively when the moon is directly overhead or underfoot during the 3 days surrounding a New or Full Moon.'
    };
  }
};

module.exports = AlmanacEngine;
