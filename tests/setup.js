/**
 * Jest test setup
 */

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_PATH = ':memory:';
process.env.LOG_LEVEL = 'error';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
