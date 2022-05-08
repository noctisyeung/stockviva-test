import getResultMessage from '@helpers/result';

describe('Result Helper', () => {
  describe('getResultMessage', () => {
    it('Should return success data structure', async () => {
      const mockData = { foo: 'bar' };

      const result = getResultMessage(true, mockData);

      expect(result).toEqual({
        status: 'success',
        data: mockData,
      });
    });

    it('Should return failed data structure', async () => {
      const mockMessage = 'error';

      const result = getResultMessage(false, null, mockMessage);

      expect(result).toEqual({
        status: 'error',
        msg: mockMessage,
      });
    });
  });
});
