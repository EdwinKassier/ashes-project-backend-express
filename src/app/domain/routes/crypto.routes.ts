import { Router } from 'express';
import {
  analyzeCrypto,
  getGraphData,
  processRequest,
  home,
} from '../controllers/crypto.controller.js';
import {
  validateQuery,
  validateParams,
} from '../../shared/middleware/validation.middleware.js';
import { cryptoAnalysisSchema, symbolParamSchema } from '../schemas/crypto.schemas.js';

const router = Router();

/**
 * Modern REST API endpoints
 */

// POST /api/v1/crypto/analysis
router.get('/analysis', validateQuery(cryptoAnalysisSchema), analyzeCrypto);

// GET /api/v1/crypto/graph/:symbol
router.get('/graph/:symbol', validateParams(symbolParamSchema), getGraphData);

/**
 * Legacy endpoints for backward compatibility
 */

// GET /process_request (no validation - handles errors internally)
router.get('/process_request', processRequest);

// GET / (home/status)
router.get('/', home);

export default router;
