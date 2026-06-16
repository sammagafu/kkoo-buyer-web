/**
 * Buyer web: vertical links stay on kkooapp.co.tz (one SPA, path-based).
 */
const env = import.meta.env;

const devOrigin = 'http://localhost:5175';
const main = env.DEV
  ? (env.VITE_MAIN_DOMAIN || devOrigin)
  : (env.VITE_MAIN_DOMAIN || 'https://kkooapp.co.tz');

export const subdomainConfig = {
  isProduction: env.PROD,
  isDevelopment: env.DEV,
  mainDomain: main,
  services: {
    eats: env.VITE_EATS_URL || `${main}/eats`,
    stay: env.VITE_STAY_URL || `${main}/booking`,
    ride: env.VITE_RIDE_URL || `${main}/ride`,
    market: env.VITE_MARKET_URL || `${main}/marketplace`,
  },
  serviceInfo: {
    eats: {
      name: "K'KOO Eats",
      icon: 'solar:cup-hot-bold',
      description: 'Order food from verified restaurants',
      color: '#F7A829',
      accentGrad: 'linear-gradient(135deg, #5C308F 0%, #F7A829 100%)',
      dark: false,
    },
    stay: {
      name: "K'KOO Stay",
      icon: 'solar:home-bold',
      description: 'Book hotels and accommodations',
      color: '#7B46B3',
      accentGrad: 'linear-gradient(135deg, #5C308F 0%, #9B59CC 100%)',
      dark: false,
    },
    ride: {
      name: "K'KOO Ride",
      icon: 'solar:delivery-bold',
      description: 'Rides and delivery',
      color: '#F7A829',
      accentGrad: 'linear-gradient(135deg, #F7A829 0%, #E8940F 100%)',
      dark: false,
    },
    market: {
      name: "K'KOO Market",
      icon: 'solar:cart-large-2-bold',
      description: 'Shop from trusted sellers',
      color: '#5C308F',
      accentGrad: 'linear-gradient(135deg, #5C308F 0%, #3B1A5A 100%)',
      dark: false,
    },
  },
  getServiceUrl(service: 'eats' | 'stay' | 'ride' | 'market'): string {
    return subdomainConfig.services[service];
  },
  getServiceInfo(service: 'eats' | 'stay' | 'ride' | 'market') {
    return subdomainConfig.serviceInfo[service];
  },
  getAllServices() {
    return [
      { key: 'eats' as const, ...subdomainConfig.serviceInfo.eats },
      { key: 'stay' as const, ...subdomainConfig.serviceInfo.stay },
      { key: 'ride' as const, ...subdomainConfig.serviceInfo.ride },
      { key: 'market' as const, ...subdomainConfig.serviceInfo.market },
    ];
  },
};

export default subdomainConfig;
