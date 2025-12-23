import request from 'supertest';
import { createApp } from '../../../src/app/app';
import { initDatabase, closeDatabase } from '../../../src/app/database/sequelize';

describe('GraphQL API', () => {
  let app;

  beforeAll(async () => {
    await initDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Health Check', () => {
    it('should return health status via GraphQL', async () => {
      // eslint-disable-next-line no-underscore-dangle
      const query = `query { _health }`;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      // eslint-disable-next-line no-underscore-dangle
      expect(response.body.data._health).toBe('GraphQL API is healthy');
    });
  });

  describe('processRequest Query', () => {
    it('should return error for empty symbol', async () => {
      const query = `
        query {
          processRequest(symbol: "", investment: 123) {
            result { symbol }
            error
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data.processRequest.error).toBe("Symbol doesn't exist");
      expect(response.body.data.processRequest.result).toBeNull();
    });

    it('should return error for invalid investment', async () => {
      const query = `
        query {
          processRequest(symbol: "ETH", investment: 0) {
            result { symbol }
            error
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data.processRequest.error).toBe('Invalid investment amount');
    });

    it('should return error for negative investment', async () => {
      const query = `
        query {
          processRequest(symbol: "ETH", investment: -100) {
            error
          }
        }
      `;

      const response = await request(app).post('/graphql').send({ query });

      expect(response.body.data.processRequest.error).toBe('Invalid investment amount');
    });
  });

  describe('GraphiQL IDE', () => {
    it('should serve GraphiQL in development', async () => {
      const response = await request(app).get('/graphiql');

      // In test environment (non-production), GraphiQL should be served
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
    });
  });

  describe('API Info Endpoint', () => {
    it('should include GraphQL endpoints in API info', async () => {
      const response = await request(app).get('/api');

      expect(response.status).toBe(200);
      expect(response.body.endpoints.graphql).toBe('/graphql');
      expect(response.body.endpoints.graphiql).toBe('/graphiql');
    });
  });
});
