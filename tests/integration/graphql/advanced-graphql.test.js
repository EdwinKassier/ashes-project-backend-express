import request from 'supertest';
import { createApp } from '../../../src/app/app';
import { initDatabase, closeDatabase } from '../../../src/app/database/sequelize';

// Increase timeout for longer database ops
jest.setTimeout(30000);

describe('Advanced GraphQL Verification', () => {
  let app;

  beforeAll(async () => {
    await initDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Data Parity with REST API', () => {
    it('should return identical crypto analysis data', async () => {
      const symbol = 'ETH';
      const investment = 1000;

      // 1. Get REST Legacy Response
      const restResponse = await request(app)
        .get('/process_request')
        .query({ symbol, investment });

      expect(restResponse.status).toBe(200);

      // 2. Get GraphQL Response
      const query = `
        query {
          processRequest(symbol: "${symbol}", investment: ${investment}) {
            result {
              symbol
              investment
              numberOfCoins
              profit
              growthFactor
              lambos
            }
            graphData {
              x
              y
            }
          }
        }
      `;

      const graphqlResponse = await request(app).post('/graphql').send({ query });

      expect(graphqlResponse.status).toBe(200);
      expect(graphqlResponse.body.errors).toBeUndefined();

      // 3. Compare Results
      // REST result
      const restResult = restResponse.body.result;

      // GraphQL result
      const gqlResult = graphqlResponse.body.data.processRequest.result;

      // Assertions
      expect(gqlResult.symbol).toBe(restResult.symbol);
      expect(gqlResult.investment).toBe(restResult.investment);
      expect(gqlResult.numberOfCoins).toBe(restResult.numberOfCoins);
      expect(gqlResult.profit).toBe(restResult.profit);
      expect(gqlResult.growthFactor).toBe(restResult.growthFactor);
      expect(gqlResult.lambos).toBe(restResult.lambos);
    });

    it('should match graph data content (parsed vs typed)', async () => {
      const symbol = 'BTC';
      const investment = 500;

      // REST (returns stringified JSON for graph_data)
      const restResponse = await request(app)
        .get('/process_request')
        .query({ symbol, investment });

      const restGraphData = JSON.parse(restResponse.body.graph_data);

      // GraphQL (returns typed array)
      const query = `
        query {
          processRequest(symbol: "${symbol}", investment: ${investment}) {
            graphData {
              x
              y
            }
          }
        }
      `;

      const graphqlResponse = await request(app).post('/graphql').send({ query });

      const gqlGraphData = graphqlResponse.body.data.processRequest.graphData;

      // Compare first and last points to ensure data integrity
      expect(gqlGraphData.length).toBe(restGraphData.length);
      expect(gqlGraphData[0]).toEqual(restGraphData[0]);
      expect(gqlGraphData[gqlGraphData.length - 1]).toEqual(
        restGraphData[restGraphData.length - 1]
      );
    });
  });

  describe('New GraphQL Queries', () => {
    it('cryptoAnalysis query should work standalone', async () => {
      const query = `
        query {
          cryptoAnalysis(input: { symbol: "BTC", investment: 100 }) {
            symbol
            profit
          }
        }
      `;

      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data.cryptoAnalysis.symbol).toBe('BTC');
      expect(res.body.data.cryptoAnalysis.profit).toBeDefined();
    });

    it('graphData query should work standalone', async () => {
      const query = `
        query {
          graphData(symbol: "ETH") {
            x
            y
          }
        }
      `;

      const res = await request(app).post('/graphql').send({ query });
      expect(Array.isArray(res.body.data.graphData)).toBe(true);
      expect(res.body.data.graphData.length).toBeGreaterThan(0);
      expect(res.body.data.graphData[0]).toHaveProperty('x');
    });
  });

  describe('Schema Introspection', () => {
    it('should expose correct types in schema', async () => {
      const query = `
        query {
          # eslint-disable-next-line no-underscore-dangle
          __type(name: "CryptoAnalysis") {
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      `;

      const res = await request(app).post('/graphql').send({ query });
      // eslint-disable-next-line no-underscore-dangle
      const fields = res.body.data.__type.fields.map((f) => f.name);

      expect(fields).toContain('symbol');
      expect(fields).toContain('investment');
      expect(fields).toContain('lambos');
      expect(fields).toContain('profit');
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should return helpful error for unknown symbol in standalone query', async () => {
      const query = `
        query {
          cryptoAnalysis(input: { symbol: "UNKNOWN_COIN", investment: 100 }) {
            profit
          }
        }
      `;

      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.errors).toBeDefined();
      // Expecting a domain error format
      expect(res.body.errors[0].message).toContain("Symbol 'UNKNOWN_COIN' not found");
      expect(res.body.errors[0].extensions.code).toBe('SYMBOL_NOT_FOUND');
    });

    it('should handle large input values gracefully', async () => {
      const query = `
        query {
          processRequest(symbol: "ETH", investment: 1000000000000) {
            result {
              lambos
            }
          }
        }
      `;

      const res = await request(app).post('/graphql').send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.processRequest.result.lambos).toBeGreaterThan(0);
    });
  });
});
