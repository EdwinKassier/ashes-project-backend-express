import { CryptoAnalysisService } from '../../../src/app/domain/services/crypto-analysis.service.js';

describe('CryptoAnalysisService', () => {
  let service;

  beforeEach(() => {
    service = new CryptoAnalysisService();
  });

  describe('calculateInvestmentReturn', () => {
    it('should calculate correct investment returns', () => {
      const result = service.calculateInvestmentReturn(
        1000, // investment
        100, // start price
        200, // end price
        'BTC'
      );

      expect(result).toMatchObject({
        symbol: 'BTC',
        investment: 1000,
        numberOfCoins: 10,
        profit: 1000,
        growthFactor: 1,
      });
    });

    it('should handle negative returns', () => {
      const result = service.calculateInvestmentReturn(
        1000,
        200, // start price
        100, // end price (lower)
        'ETH'
      );

      expect(result.profit).toBeLessThan(0);
      expect(result.growthFactor).toBeLessThan(0);
    });

    it('should calculate lambos correctly', () => {
      const result = service.calculateInvestmentReturn(
        1000,
        1, // start price
        201, // end price
        'BTC'
      );

      // Profit should be 200,000 (1000 coins * 200 gain)
      // Lambos should be 1 (200,000 / 200,000)
      expect(result.lambos).toBe(1);
    });
  });
});
