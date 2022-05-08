import {
  TCryptoLatestsResponseData,
  TCryptoListingsLatestResponse,
  TCryptoPriceConversionResponse,
  TCryptoPriceConversionResponseData,
  TGetCryptoPayload,
} from '@custom-types/crypto.type';
import config from '@helpers/config';
import getResultMessage from '@helpers/result';
import axios from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limitOpts = {
  points: 333, // We have 333 quota per day
  duration: 24 * 60 * 60,
};

class CryptoController {
  private axiosInstance = axios.create({
    baseURL: config.coinMarketCapApiUrl,
    headers: {
      'X-CMC_PRO_API_KEY': config.coinMarketCapApiKey as string,
    },
  });

  private cryptoRateLimiter = new RateLimiterMemory(limitOpts);

  /**
   * Method to return the crypto data from the APi provider
   *
   * @param {string} currency Used to convert the crypto currency to the desired currency
   * @returns {Promise<any>} Return list of the crypto name or err message
   */
  async getCrypto(currency?: string): Promise<TGetCryptoPayload> {
    try {
      const maxResult = await this.getCryptoByPercentage({ max: -5, currency });
      if (typeof maxResult === 'string') {
        return getResultMessage(false, null, maxResult);
      }
      const minResult = await this.getCryptoByPercentage({ min: 5, currency });
      if (typeof minResult === 'string') {
        return getResultMessage(false, null, minResult);
      }
      const result = [...maxResult, ...minResult].map((x) => ({
        id: x.id,
        name: x.name,
        symbol: x.symbol,
        ...(currency && { originPrice: `USD$${x.quote.USD.price}` }),
        price: !currency
          ? `USD$${x.quote.USD.price}`
          : `${currency?.trim().toUpperCase()}$${x.convertedPrice}`,
        percentChange24h: x.quote.USD.percent_change_24h,
      }));
      const responseData = getResultMessage(true, result);

      return responseData;
    } catch (e: any) {
      return getResultMessage(false, null, 'Unexpected Error');
    }
  }

  private async getCryptoByPercentage({
    max,
    min,
    currency,
  }: {
    max?: number;
    min?: number;
    currency?: string;
  }): Promise<TCryptoLatestsResponseData[] | string> {
    let result = [];
    const requestList = [];
    const offset = 200;
    /**
     * Each API call is limited to 5K results and 200 data per 1 credit
     * All the pagination is inside the status headers
     */
    try {
      // Count 1 limit
      await this.cryptoRateLimiter.consume('crypto-get-latest-list', 1);
      const response =
        await this.axiosInstance.get<TCryptoListingsLatestResponse>(
          'v1/cryptocurrency/listings/latest',
          {
            params: {
              start: 1,
              limit: offset,
              price_min: 1,
              // Less than 5%
              ...(max && { percent_change_24h_max: -5 }),
              // More than 5%
              ...(min && { percent_change_24h_min: 5 }),
            },
          },
        );
      if (response?.status === 200) {
        const { status: meta, data: resData } = response.data;
        result.push(resData);
        if (meta.total_count && meta.total_count > offset) {
          const numberOfChunks = Math.ceil(meta.total_count / offset);
          // Create the promise array for the request
          for (let i = 0; i < numberOfChunks - 1; ) {
            requestList.push(
              this.axiosInstance.get<TCryptoListingsLatestResponse>(
                'v1/cryptocurrency/listings/latest',
                {
                  params: {
                    start: (i + 1) * offset + 1,
                    limit: offset,
                    // Less than 5%
                    ...(max && { percent_change_24h_max: max }),
                    // More than 5%
                    ...(min && { percent_change_24h_min: min }),
                  },
                },
              ),
            );
            i += 1;
          }
          const resList = await Promise.all(requestList);
          // Count n limit
          await this.cryptoRateLimiter.consume(
            'crypto-get-latest-list',
            requestList.length,
          );
          resList.forEach((res) => {
            result.push(res.data.data);
          });
        }
        if (currency) {
          const convertResult = await this.cryptoCurrencyConvert(currency);
          if (typeof convertResult === 'string') {
            return convertResult;
          }
          result = result.flat().map((x) => ({
            ...x,
            convertedPrice:
              (x.quote!.USD.price! as number) *
              convertResult.quote[currency.trim().toUpperCase()].price!,
          }));
        }
        return result.flat();
      }
    } catch (err: any) {
      if (err?.msBeforeNext) {
        return 'Sorry, your API call quota exceed. please try after 24 hours';
      }
      if (err?.response) {
        return (
          err.response?.data?.status?.error_message ||
          err.response?.data.message
        );
      }
      return err.message;
    }
    return 'Unexpected Error';
  }

  private async cryptoCurrencyConvert(
    currency: string,
  ): Promise<TCryptoPriceConversionResponseData | string> {
    try {
      await this.cryptoRateLimiter.consume('crypto-get-convert', 1);
      const response =
        await this.axiosInstance.get<TCryptoPriceConversionResponse>(
          'v2/tools/price-conversion',
          {
            params: {
              symbol: 'USD',
              amount: 1,
              convert: currency.trim().toUpperCase(),
            },
          },
        );
      if (response.status === 200) {
        // The sandbox API is returning different structure from production and we Massage is here
        if (process.env.NODE_ENV !== 'production') {
          return (response.data.data as any)
            .USD as TCryptoPriceConversionResponseData;
        }
        return response.data.data?.[0];
      }
    } catch (err: any) {
      if (err?.msBeforeNext) {
        return 'Sorry, your API call quota exceed. please try after 24 hours';
      }
      if (err?.response) {
        return (
          err.response?.data?.status?.error_message ||
          err.response?.data.message
        );
      }
      return err.message;
    }
    return 'Unexpected Error';
  }
}

export default CryptoController;
