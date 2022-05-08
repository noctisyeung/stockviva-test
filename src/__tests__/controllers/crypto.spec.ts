import Controllers from '@controllers/_controllers';
import { IControllers } from '@custom-types/_types';
import {
  mockCoinMarketCurrencyResponse,
  mockCoinMarketLatestLargeResponse,
  mockCoinMarketLatestResponse,
  mockLimitedRejected,
  mockLimitExceedResult,
  mockSuccessWithCurrency,
  mockSuccessWithoutCurrency,
  mockSuccessWithoutCurrencyLarge,
  mockUnexpectedResult,
} from '@tests/__mocks__/crypto.mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);
const mockConsume = jest.fn();

jest.mock('rate-limiter-flexible', () => {
  return {
    RateLimiterMemory: jest.fn().mockImplementation(() => ({
      consume: mockConsume,
    })),
  };
});

describe('Crypto Controller', () => {
  beforeAll(() => {
    process.env = {
      NODE_ENV: 'production',
    };
  });
  describe('getCrypto', () => {
    it('Should return unexpected error', async () => {
      const controllers: IControllers = Controllers.getControllers();
      const result = await controllers.cryptoController.getCrypto();

      expect(result).toMatchObject(mockUnexpectedResult);
    });

    it('Should return limit exceed error', async () => {
      mockConsume.mockRejectedValueOnce(mockLimitedRejected);

      const controllers: IControllers = Controllers.getControllers();
      const result = await controllers.cryptoController.getCrypto();

      expect(result).toMatchObject(mockLimitExceedResult);
    });

    it('Should return success without currency', async () => {
      mockAxios
        .onGet('v1/cryptocurrency/listings/latest')
        .reply(200, mockCoinMarketLatestResponse);
      mockConsume.mockResolvedValueOnce('ok');

      const controllers: IControllers = Controllers.getControllers();
      const result = await controllers.cryptoController.getCrypto();

      expect(result).toMatchObject(mockSuccessWithoutCurrency);
    });

    it('Should return success without currency in large list', async () => {
      mockAxios
        .onGet('v1/cryptocurrency/listings/latest')
        .reply(200, mockCoinMarketLatestLargeResponse);
      mockConsume.mockResolvedValueOnce('ok');

      const controllers: IControllers = Controllers.getControllers();
      const result = await controllers.cryptoController.getCrypto();

      expect(result).toMatchObject(mockSuccessWithoutCurrencyLarge);
    });

    it('Should return success with currency', async () => {
      mockAxios
        .onGet('v1/cryptocurrency/listings/latest')
        .reply(200, mockCoinMarketLatestResponse);
      mockAxios
        .onGet('v2/tools/price-conversion')
        .reply(200, mockCoinMarketCurrencyResponse);
      mockConsume.mockResolvedValueOnce('ok');

      const controllers: IControllers = Controllers.getControllers();
      const result = await controllers.cryptoController.getCrypto('JPY');

      expect(result).toMatchObject(mockSuccessWithCurrency);
    });
  });
});
