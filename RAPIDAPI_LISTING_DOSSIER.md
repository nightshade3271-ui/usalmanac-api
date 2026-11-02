# USAlmanac API — RapidAPI Marketplace Listing Dossier

> **Ready-to-Deploy Listing Sheet for RapidAPI Studio**  
> Target Category: **Agriculture, Farming** (Dominates the 11-API category on RapidAPI!)  
> Target Base URL: `https://usalmanac-api.vercel.app`

---

## 1. Core Metadata

- **API Name:** `USAlmanac API`
- **Short Tagline:** The Digital Farmer's Almanac & Astronomical AgTech API.
- **Category:** `Agriculture, Farming` *(Also recommended secondary: Weather, Tools)*
- **Primary Website:** `https://usalmanac-api.vercel.app`
- **Terms of Service URL:** `https://usalmanac-api.vercel.app/terms`
- **OpenAPI 3.0 File:** Upload [`rapidapi-openapi.json`](file:///c:/Users/jewel/Desktop/Tink/usalmanac-api/rapidapi-openapi.json)
- **API Logo:** [`logo.svg`](file:///c:/Users/jewel/Desktop/Tink/usalmanac-api/logo.svg) or [`public/logo.svg`](file:///c:/Users/jewel/Desktop/Tink/usalmanac-api/public/logo.svg)

---

## 2. Short Description
> Pure astronomical ephemeris, USDA plant hardiness zones, frost dates, planting-by-the-moon schedules, folklore weather proverbs, and solunar fishing/hunting tables for developers and modern AgTech platforms.

---

## 3. Long Description (Markdown for RapidAPI "About" Tab)

```markdown
# 🌾 USAlmanac API — The Digital Farmer's Almanac for Modern AgTech

**USAlmanac API** brings 230 years of traditional American agricultural wisdom into modern software engineering. Built on high-precision astronomical algorithms and official USDA plant hardiness datasets, USAlmanac provides developers, homesteaders, gardening apps, and agricultural tech platforms with instant access to lunar planting cycles, frost windows, folklore proverbs, and solunar wildlife activity tables.

Sub-50ms execution, zero third-party dependencies, and 100% serverless edge availability.

---

### 🌟 Key Capabilities

1. **🌙 Pure Astronomical Lunar Ephemeris**
   - Precise phase calculation (Waxing/Waning Crescent, Gibbous, Full, New Moon).
   - Lunar illumination percentage, moon age (0–29.53 days), and phase angle.
   - Tropical zodiac sign calculation (Aries through Pisces).
   - Astrological element (Water, Earth, Air, Fire) and soil fertility status (Fertile, Semi-Fertile, Barren).

2. **🌱 USDA Hardiness Zones & Frost Dates**
   - 5-digit US ZIP code resolution across zones 3a through 11a.
   - Median spring last frost date (safe outdoor sowing).
   - Median fall first frost date (harvest cutoff).
   - Total frost-free growing season days.
   - Extreme annual minimum temperature thresholds.

3. **📅 Best Days by the Moon**
   - Astrological timing for 11 core agricultural & homestead activities:
     - Planting above-ground crops
     - Planting root crops
     - Fishing & angling
     - Setting eggs & incubating poultry
     - Pruning to encourage vigor
     - Pruning to retard growth
     - Harvesting & grain storage
     - Canning, pickling, & preserving
     - Brewing & cider fermentation
     - Butchering & curing
     - Weeding & pest eradication

4. **🍅 Moon-Aligned Crop Planting Catalog**
   - Detailed timing for warm and cool season vegetables (Tomatoes, Peppers, Squash, Carrots, Onions, Spinach, Lettuce, etc.).
   - Indoor seed-starting windows vs outdoor direct sowing/transplanting.
   - Traditional waxing/waning moon alignment recommendations.
   - Scientifically validated beneficial companion planting pairs and antagonistic crops.

5. **🎣 Solunar Hunting & Fishing Feeding Tables**
   - Based on John Alden Knight's Solunar Theory.
   - Major feeding periods (Lunar transit overhead and underfoot - 2h windows).
   - Minor feeding periods (Moonrise and moonset - 1h windows).
   - Daily activity score (0–100) and star rating (Poor to Excellent ★★★★).

6. **📜 Daily Weather Folklore Proverbs**
   - Authentic, historically documented American weather proverbs and agrarian lore for each day of the year.

---

### 🚀 Common Use Cases

- **Smart Gardening & Homestead Apps:** Automatically advise users on the best days to sow seeds, transplant, or prune based on their local ZIP code.
- **AgTech & Precision Farming Dashboards:** Combine USDA frost safety windows with lunar moisture cycles.
- **Hunting & Fishing Applications:** Provide anglers and sportsmen with solunar peak feeding times and activity ratings.
- **Seed Companies & Nursery E-Commerce:** Recommend personalized planting calendars directly on plant product pages.
- **Weather & IoT Smart Calendars:** Integrate daily folklore proverbs and astronomical moon phase visuals into smart displays.

---

### ⚡ Quick Start (cURL)

```bash
# Get daily almanac for Dayton, Ohio (ZIP 45402)
curl -X GET "https://usalmanac-api.p.rapidapi.com/v1/almanac/daily?zip=45402&date=2026-05-15" \
  -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  -H "X-RapidAPI-Host: usalmanac-api.p.rapidapi.com"
```

### ⚡ Quick Start (Node.js)

```javascript
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://usalmanac-api.p.rapidapi.com/v1/almanac/best-days',
  params: { month: '5', year: '2026' },
  headers: {
    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
    'X-RapidAPI-Host': 'usalmanac-api.p.rapidapi.com'
  }
};

const response = await axios.request(options);
console.log(response.data);
```

### ⚡ Quick Start (Python)

```python
import requests

url = "https://usalmanac-api.p.rapidapi.com/v1/almanac/crops"
headers = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "usalmanac-api.p.rapidapi.com"
}
params = {"zip": "45402"}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```
```

---

## 4. Monetization & Pricing Tiers

Set up these 4 tiers in RapidAPI Studio -> **Monetization**:

| Tier Name | Price | Requests / Month | Overage Rate | Rate Limit |
|---|---|---|---|---|
| **BASIC (Free)** | **$0.00 / mo** | **50 calls** | Hard limit (no overage) | 5 req / sec |
| **PRO (Green Thumb)** | **$19.00 / mo** | **1,500 calls** | $0.02 / call | 15 req / sec |
| **ULTRA (Homestead)** | **$49.00 / mo** | **7,500 calls** | $0.01 / call | 30 req / sec |
| **MEGA (Commercial)** | **$149.00 / mo** | **25,000 calls** | $0.005 / call | 60 req / sec |

---

## 5. Endpoints Configuration

| Endpoint | Method | Path | Summary | Query Params |
|---|---|---|---|---|
| **Daily Almanac** | `GET` | `/v1/almanac/daily` | Complete daily lunar, frost, advice & proverb | `zip` (optional, default: 45402), `date` (optional, YYYY-MM-DD) |
| **Best Days** | `GET` | `/v1/almanac/best-days` | Monthly calendar of best days for 11 chores | `month` (1-12), `year` (YYYY) |
| **Crop Schedule** | `GET` | `/v1/almanac/crops` | Tailored planting schedule & companion plants | `zip` or `zone`, `crop` (optional) |
| **Lunar Ephemeris** | `GET` | `/v1/almanac/lunar` | Pure astronomical moon phase & zodiac fertility | `date` (optional, YYYY-MM-DD) |
| **USDA Frost Dates** | `GET` | `/v1/almanac/frost` | ZIP code to USDA Zone, frost dates & season | `zip` (required) |
| **Solunar Tables** | `GET` | `/v1/almanac/solunar` | Solunar feeding windows, score & rating | `zip` (optional), `date` (optional) |

---

## 6. Target Gateway URL

In RapidAPI Studio -> **Target URLs**:
- **Target URL:** `https://usalmanac-api.vercel.app`
- **Proxy Secret:** Set environment variable `RAPIDAPI_PROXY_SECRET` on Vercel to match RapidAPI's proxy secret for enterprise security.
