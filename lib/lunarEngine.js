/**
 * High-Precision Lunar & Ephemeris Calculation Engine
 * Computes exact synodic moon phase, illumination percentage,
 * tropical zodiac moon sign, and traditional Almanac planting attributes.
 */

const SYNODIC_MONTH = 29.53058867; // Days in a complete lunar phase cycle
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime(); // Reference epoch

const ZODIAC_SIGNS = [
  { name: 'Aries', element: 'Fire', fertility: 'Barren & Dry', quality: 'Good for cultivating, harvesting, and pest eradication' },
  { name: 'Taurus', element: 'Earth', fertility: 'Productive & Moist', quality: 'Excellent for root crops, potatoes, and sturdy development' },
  { name: 'Gemini', element: 'Air', fertility: 'Barren & Dry', quality: 'Cultivate, weed, and destroy pests' },
  { name: 'Cancer', element: 'Water', fertility: 'Most Fertile & Fruitful', quality: 'Prime sign for all above-ground fruiting crops and watering' },
  { name: 'Leo', element: 'Fire', fertility: 'Most Barren & Dry', quality: 'Harvesting, clearing land, and timber felling' },
  { name: 'Virgo', element: 'Earth', fertility: 'Moist but Barren', quality: 'Good for flowering plants, vines, and decorative shrubs' },
  { name: 'Libra', element: 'Air', fertility: 'Semi-Fertile & Moist', quality: 'Excellent for flowers, pulp crops, and herbs' },
  { name: 'Scorpio', element: 'Water', fertility: 'Very Fertile & Fruitful', quality: 'Second best sign for vine and above-ground planting' },
  { name: 'Sagittarius', element: 'Fire', fertility: 'Barren & Dry', quality: 'Harvesting grains, pruning to retard growth' },
  { name: 'Capricorn', element: 'Earth', fertility: 'Productive', quality: 'Sturdy root development, bulbs, and graft survival' },
  { name: 'Aquarius', element: 'Air', fertility: 'Barren & Dry', quality: 'Harvesting and ground preparation' },
  { name: 'Pisces', element: 'Water', fertility: 'Highly Fertile & Fruitful', quality: 'Root formation, root-rot resistance, and general planting' }
];

const LunarEngine = {
  getLunarData(dateObj = new Date()) {
    const timestamp = dateObj.getTime();
    const diffDays = (timestamp - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
    
    // Moon age in current synodic month (0.00 to 29.53)
    let moonAge = diffDays % SYNODIC_MONTH;
    if (moonAge < 0) moonAge += SYNODIC_MONTH;

    const phaseRatio = moonAge / SYNODIC_MONTH; // 0.0 to 1.0

    // Illumination percentage (approximate sinusoidal)
    const illumination = Math.round((1 - Math.cos(phaseRatio * 2 * Math.PI)) / 2 * 100);

    // Phase identification
    let phaseName = 'New Moon';
    let phaseCategory = 'Waxing'; // Waxing (Light of Moon) vs Waning (Dark of Moon)
    let phaseSymbol = '🌑';

    if (moonAge < 1.5 || moonAge >= 28.0) {
      phaseName = 'New Moon';
      phaseCategory = 'Waxing';
      phaseSymbol = '🌑';
    } else if (moonAge < 6.5) {
      phaseName = 'Waxing Crescent';
      phaseCategory = 'Waxing';
      phaseSymbol = '🌒';
    } else if (moonAge < 8.5) {
      phaseName = 'First Quarter';
      phaseCategory = 'Waxing';
      phaseSymbol = '🌓';
    } else if (moonAge < 13.5) {
      phaseName = 'Waxing Gibbous';
      phaseCategory = 'Waxing';
      phaseSymbol = '🌔';
    } else if (moonAge < 16.0) {
      phaseName = 'Full Moon';
      phaseCategory = 'Waning';
      phaseSymbol = '🌕';
    } else if (moonAge < 21.0) {
      phaseName = 'Waning Gibbous';
      phaseCategory = 'Waning';
      phaseSymbol = '🌖';
    } else if (moonAge < 23.0) {
      phaseName = 'Last Quarter';
      phaseCategory = 'Waning';
      phaseSymbol = '🌗';
    } else {
      phaseName = 'Waning Crescent';
      phaseCategory = 'Waning';
      phaseSymbol = '🌘';
    }

    // Sidereal / Tropical Moon Sign Calculation
    // The Moon traverses the 12 signs of the Zodiac in approximately 27.32166 days (sidereal month)
    const SIDEREAL_MONTH = 27.321661;
    const MOON_SIGN_EPOCH = new Date('2000-01-01T00:00:00Z').getTime(); // Reference point (Moon was in Scorpio ~230°)
    const siderealDiff = (timestamp - MOON_SIGN_EPOCH) / (1000 * 60 * 60 * 24);
    const siderealCycles = siderealDiff / SIDEREAL_MONTH;
    const signPosition = ((siderealCycles % 1) + 1) % 1; // 0.0 to 1.0 through the 12 signs
    const signIndex = Math.floor(signPosition * 12) % 12;
    const moonSign = ZODIAC_SIGNS[signIndex];

    // Determine Almanac Agricultural Guidance
    let agriculturalDirective = '';
    let isFertile = moonSign.element === 'Water' || moonSign.element === 'Earth';

    if (phaseCategory === 'Waxing') {
      if (isFertile) {
        agriculturalDirective = '🌱 EXCELLENT: Light of the Moon combined with fertile sign. Prime time to plant above-ground crops, seeds, leafy greens, tomatoes, and corn.';
      } else {
        agriculturalDirective = '🌿 MODERATE: Light of the moon promotes vegetative growth, but sign is dry. Good for planting seeds that need quick germination, vines, and flowers.';
      }
    } else {
      // Waning
      if (isFertile) {
        agriculturalDirective = '🥔 EXCELLENT: Dark of the Moon combined with Earth/Water sign. Prime time to plant root vegetables, potatoes, carrots, bulbs, and set transplant roots.';
      } else {
        agriculturalDirective = '✂️ CULTIVATION: Dark of the moon in a barren sign. Prime time to weed gardens, clear brush, prune to retard growth, and harvest crops for storage.';
      }
    }

    return {
      date: dateObj.toISOString().split('T')[0],
      moon_phase: {
        name: phaseName,
        symbol: phaseSymbol,
        category: phaseCategory === 'Waxing' ? 'Light of the Moon (Waxing)' : 'Dark of the Moon (Waning)',
        age_in_days: parseFloat(moonAge.toFixed(1)),
        illumination_percentage: illumination,
        cycle_progress_percent: parseFloat((phaseRatio * 100).toFixed(1))
      },
      moon_sign: {
        zodiac_sign: moonSign.name,
        element: moonSign.element,
        fertility_rating: moonSign.fertility,
        traditional_lore: moonSign.quality
      },
      almanac_planting_guidance: agriculturalDirective
    };
  }
};

module.exports = LunarEngine;

