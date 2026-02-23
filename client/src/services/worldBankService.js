/**
 * worldBankService.js
 * Fetches GDP data from World Bank via RapidAPI.
 * Falls back to curated dummy data if the request fails.
 * Does NOT modify any existing API services.
 */

const RAPID_API_KEY  = import.meta.env.VITE_RAPIDAPI_KEY || '64d0e30511mshddf7bf026355b07p186714jsnc4c7e90848e4';
const RAPID_API_HOST = 'world-bank-gdp.p.rapidapi.com';

export const DUMMY_GDP_DATA = [
  { country: 'India',          code: 'IND', gdp: 3.73,  unit: 'T', year: 2024, growth: '+8.2%' },
  { country: 'United States',  code: 'USA', gdp: 27.36, unit: 'T', year: 2024, growth: '+2.5%' },
  { country: 'China',          code: 'CHN', gdp: 17.79, unit: 'T', year: 2024, growth: '+5.2%' },
  { country: 'Germany',        code: 'DEU', gdp: 4.46,  unit: 'T', year: 2024, growth: '-0.3%' },
  { country: 'United Kingdom', code: 'GBR', gdp: 3.09,  unit: 'T', year: 2024, growth: '+0.1%' },
  { country: 'Japan',          code: 'JPN', gdp: 4.11,  unit: 'T', year: 2024, growth: '+1.9%' },
];

export async function fetchWorldBankGDP() {
  try {
    const res = await fetch(`https://${RAPID_API_HOST}/`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key':  RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();

    // If the API returns an array, map to our shape; else fall back
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter(item => item?.country?.value && item?.value != null)
        .slice(0, 6)
        .map(item => ({
          country: item.country.value,
          code:    item.countryiso3code || '---',
          gdp:     (item.value / 1e12).toFixed(2),
          unit:    'T',
          year:    item.date || '2024',
          growth:  '+N/A',
        }));
    }
    return DUMMY_GDP_DATA;
  } catch {
    return DUMMY_GDP_DATA;
  }
}
