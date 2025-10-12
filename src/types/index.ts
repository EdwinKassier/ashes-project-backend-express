import type { Request, Response, NextFunction } from 'express';

// Environment
export type NodeEnv = 'development' | 'test' | 'production';

// Request/Response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: ValidationError[];
}

export interface ValidationError {
  message: string;
  path: string;
  code: string;
}

// Express types
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Response;

// Domain types
export interface CryptoAnalysisResult {
  symbol: string;
  investment: number;
  numberOfCoins: number;
  profit: number;
  growthFactor: number;
  lambos: number;
  timestamp: Date;
}

export interface GraphDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Database types
export interface DatabaseConfig {
  dialect: 'sqlite';
  storage: string;
  logging: boolean | ((sql: string) => void);
}

// Config types
export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  jwtSecret: string;
  database: DatabaseConfig;
  allowedOrigins: string[];
  rateLimitMax: number;
  rateLimitWindowMs: number;
  logLevel: string;
}

// Error types
export interface OperationalError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}

// Logger types
export interface LoggerMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Logger {
  error(message: string, meta?: LoggerMeta): void;
  warn(message: string, meta?: LoggerMeta): void;
  info(message: string, meta?: LoggerMeta): void;
  http(message: string, meta?: LoggerMeta): void;
  debug(message: string, meta?: LoggerMeta): void;
}
