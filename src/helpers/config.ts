const productionConfig = {
  coinMarketCapApiKey: process.env.COIN_MARKET_CAP_API_KEY,
  coinMarketCapApiUrl: 'https://pro-api.coinmarketcap.com/',
};

const developmentConfig = {
  coinMarketCapApiKey: process.env.COIN_MARKET_CAP_API_KEY,
  coinMarketCapApiUrl: 'https://sandbox-api.coinmarketcap.com/',
};

const config =
  process.env.NODE_ENV !== 'production' ? developmentConfig : productionConfig;

export default config;
