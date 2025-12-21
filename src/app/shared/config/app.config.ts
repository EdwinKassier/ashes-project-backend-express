import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

interface DatabaseConfig {
  dialect: 'sqlite';
  storage: string;
  logging: boolean | ((sql: string) => void);
}

interface RateLimitConfig {
  enabled: boolean;
  windowMs: number;
  max: number;
}

interface LoggingConfig {
  level: string;
  format: string;
}

interface AppConfig {
  port: number;
  nodeEnv: NodeEnv;
  jwtSecret: string;
  allowedOrigins: string[];
  database: DatabaseConfig;
  krakenApiUrl: string;
  rateLimit: RateLimitConfig;
  logging: LoggingConfig;
}

/**
 * Application configuration
 * Validates required environment variables on startup
 */
const config: AppConfig = {
  // Server
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: (process.env.NODE_ENV as NodeEnv) || 'development',

  // Security
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],

  // Database
  database: {
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './data/database.sqlite',
    // eslint-disable-next-line no-console
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },

  // External APIs
  krakenApiUrl: process.env.KRAKEN_API_URL || 'https://api.kraken.com/0/public',

  // Rate limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
};

// Validate required configuration in production
const requiredEnvVars: string[] = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) =>
    !process.env[envVar] || process.env[envVar] === 'dev-secret-change-in-production'
);

if (missingEnvVars.length > 0 && config.nodeEnv === 'production') {
  // eslint-disable-next-line no-console
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export default config;
