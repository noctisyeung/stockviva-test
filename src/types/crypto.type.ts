export type TCryptoStatus = {
  timestamp: string;
  error_code: number;
  error_message: string;
  elapsed: number;
  credit_count: number;
  total_count?: number;
};

export type TCryptoLatestsResponseData = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank?: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  market_cap_by_total_supply?: number;
  max_supply: number;
  last_updated: string;
  date_added: string;
  tags: string[];
  self_reported_circulating_supply?: number;
  self_reported_market_cap?: number;
  convertedPrice?: number;
  platform?: {
    is: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  }[];
  quote: {
    [key: string]: {
      price?: number;
      volume_24h?: number;
      volume_change_24h?: number;
      percent_change_1h?: number;
      percent_change_24h?: number;
      percent_change_7d?: number;
      market_cap?: number;
      market_cap_dominance?: number;
      fully_diluted_market_cap?: number;
      last_updated?: string;
    };
  };
};

export type TCryptoPriceConversionResponseData = {
  symbol: string;
  id: string;
  name: string;
  amount: number;
  last_updated: string;
  quote: {
    [key: string]: {
      price: number;
      last_updated: string;
    };
  };
};

export type TCryptoListingsLatestResponse = {
  status: TCryptoStatus;
  data: TCryptoLatestsResponseData[];
};

export type TCryptoPriceConversionResponse = {
  status: TCryptoStatus;
  data: TCryptoPriceConversionResponseData[];
};

export type TGetCryptoPayload = {
  id: number;
  name: string;
  symbol: string;
  originPrice?: string;
  price: string;
  percentChange24h: number;
};
