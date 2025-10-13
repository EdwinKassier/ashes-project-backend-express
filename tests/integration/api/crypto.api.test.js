import request from 'supertest';
import { createApp } from '../../../src/app/app';
import { initDatabase, closeDatabase } from '../../../src/app/database/sequelize';

describe('Crypto API Integration Tests', () => {
  let app;

  beforeAll(async () => {
    await initDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'dwml-backend-express');
    });
  });

  describe('GET /', () => {
    it('should return home message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result', 'Express server is running');
      expect(response.body).toHaveProperty('status', true);
    });
  });

  describe('GET /api/v1/crypto/analysis', () => {
    it('should return validation error for missing symbol', async () => {
      const response = await request(app).get('/api/v1/crypto/analysis').query({
        investment: 1000,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for invalid investment', async () => {
      const response = await request(app).get('/api/v1/crypto/analysis').query({
        symbol: 'BTC',
        investment: -100,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /process_request (Legacy)', () => {
    it('should handle missing symbol', async () => {
      const response = await request(app).get('/process_request').query({
        investment: 123,
      });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe("Symbol doesn't exist");
    });

    it('should handle invalid investment', async () => {
      const response = await request(app).get('/process_request').query({
        symbol: 'ETH',
        investment: 'invalid',
      });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe('Invalid investment amount');
    });
  });
});
