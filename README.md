<div align="center">

# DWML Backend Express API

**A modern Express.js API boilerplate for rapid development**

[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![Express 4.18+](https://img.shields.io/badge/express-4.18+-blue.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)
[![Code style: Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Installation Options](#installation-options)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Security](#security)
- [CI/CD Pipeline](#cicd-pipeline)
- [Available Commands](#available-commands)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

A production-ready Express.js API implementing cryptocurrency investment analysis with clean domain-driven architecture, comprehensive testing, and automated CI/CD pipelines.

### Feature Overview

| **Development** | **Testing** | **Deployment** |
|:---|:---|:---|
| Pre-commit hooks (Husky) | Unit tests | Docker containers |
| Code formatting (Prettier) | Integration tests | CI/CD pipeline |
| Linting (ESLint) | E2E tests (Playwright) | Health monitoring |
| Hot reload (Nodemon) | 75%+ coverage | Graceful shutdown |

---

## Key Features

| **Architecture** | **Security** | **Monitoring** | **Performance** |
|:---|:---|:---|:---|
| Domain-Driven Design | Security Headers (Helmet) | Health Checks | SQLite Database |
| Repository Pattern | Rate Limiting | Winston Logging | Compression |
| Service Layer | Input Validation (Joi) | Error Tracking | Response Caching |
| Clean Separation | CORS Protection | Request Logging | Production Ready |

### Feature Details

<details>
<summary><b>🔒 Security Features</b></summary>

- ✅ **Security Headers**: Helmet middleware with CSP, HSTS, XSS protection
- ✅ **Input Validation**: Joi schemas for all API endpoints
- ✅ **Rate Limiting**: Configurable rate limiting per IP
- ✅ **CORS Protection**: Configurable CORS policies
- ✅ **JWT Authentication**: Ready-to-use authentication middleware

</details>

<details>
<summary><b>🏗️ Architecture</b></summary>

- ✅ **Domain-Driven Design**: Complete vertical slice ownership
- ✅ **Repository Pattern**: Clean database access layer
- ✅ **Service Layer**: Business logic orchestration
- ✅ **Function-based Controllers**: Express best practices
- ✅ **Central Router**: Single registration point

</details>

<details>
<summary><b>🧪 Testing & Quality</b></summary>

- ✅ **Unit Tests**: Jest with 75%+ coverage
- ✅ **Integration Tests**: Supertest for API testing
- ✅ **E2E Tests**: Playwright for end-to-end scenarios
- ✅ **Pre-commit Hooks**: Husky + lint-staged
- ✅ **Code Quality**: ESLint + Prettier

</details>

---

## System Architecture

### Application Structure

```
dwml-backend-express/
├── src/app/
│   ├── domain/              # Business domain
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database access
│   │   ├── routes/          # API routes
│   │   ├── schemas/         # Validation (Joi)
│   │   ├── exceptions/      # Domain errors
│   │   └── constants.js     # Domain constants
│   ├── shared/              # Shared infrastructure
│   │   ├── middleware/      # Cross-cutting concerns
│   │   ├── config/          # Configuration
│   │   └── utils/           # Utilities
│   ├── database/            # Database layer
│   │   ├── sequelize.js     # DB connection
│   │   └── models/          # Sequelize models
│   ├── app.js               # Express app
│   ├── router.js            # Central router
│   └── server.js            # HTTP server
├── tests/                   # Test suites
├── .github/workflows/       # CI/CD
└── index.js                 # Entry point
```

### Architecture Principles

**Domain-Driven Design:**
- **Controllers**: Thin request handlers
- **Services**: Business logic orchestration
- **Repositories**: Database access abstraction
- **Schemas**: Request/response validation
- **Exceptions**: Domain-specific errors

**Shared Infrastructure:**
- **Middleware**: Auth, CORS, rate limiting, security, validation
- **Config**: Environment-based configuration
- **Utils**: Logger, response formatters

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- **npm or pnpm**
- **Git**
- **Docker (optional)**

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd dwml-backend-express
```

#### 2. Install Dependencies

```bash
make install-dev
# OR
npm install
```

#### 3. Configure Environment

Create `.env` file:

```bash
# Copy example
cp .env.example .env

# Edit with your settings
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
DB_PATH=./data/database.sqlite
ALLOWED_ORIGINS=http://localhost:3000
```

#### 4. Start Development Server

```bash
make dev
# OR
npm run dev
```

The API will be available at: **http://localhost:3000**

---

## Installation Options

### Option 1: Make Commands (Recommended)

```bash
make install-dev  # Install + setup hooks
make dev          # Start development server
```

### Option 2: Docker Compose

```bash
docker-compose up -d  # Start in background
docker-compose logs -f app  # View logs
```

### Option 3: Manual Installation

```bash
npm install
npx husky install
npm run dev
```

---

## Testing

### Testing Suite

| **Test Type** | **Command** | **Description** |
|:---|:---|:---|
| **All Tests** | `make test` | Run complete test suite with coverage |
| **Unit Tests** | `make test-unit` | Test services, repositories, utils |
| **Integration** | `make test-integration` | Test API endpoints |
| **E2E Tests** | `make test-e2e` | End-to-end with Playwright |
| **Watch Mode** | `make test-watch` | Run tests in watch mode |

### Coverage Goals

| Component | Target | Status |
|:---|:---:|:---:|
| **Overall** | 75%+ | ✅ |
| **Services** | 80%+ | ✅ |
| **Repositories** | 75%+ | ✅ |

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run specific test file
npm test tests/unit/services/crypto-analysis.service.test.js

# Run in watch mode
npm run test:watch
```

---

## Code Quality

### Automated Quality Tools

| **Tool** | **Command** | **Purpose** |
|:---|:---|:---|
| **ESLint** | `make lint` | Code linting (Airbnb style) |
| **Prettier** | `make format` | Code formatting |
| **Husky** | Auto on commit | Pre-commit hooks |
| **lint-staged** | Auto on commit | Lint only changed files |

### Pre-commit Hooks

Automatically runs on every commit:
- ✅ ESLint with auto-fix
- ✅ Prettier formatting
- ✅ No commits if linting fails

---

## Security

### Security Measures

| **Feature** | **Implementation** | **Status** |
|:---|:---|:---:|
| **Security Headers** | Helmet + custom config | ✅ |
| **Input Validation** | Joi schemas | ✅ |
| **Rate Limiting** | express-rate-limit | ✅ |
| **CORS** | Configurable origins | ✅ |
| **Authentication** | JWT middleware | ✅ |
| **Audit** | npm audit | ✅ |

### Security Configuration

```javascript
// Automatic security headers
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Content-Security-Policy
// - HSTS with preload

// Rate limiting (default)
// - 100 requests per 15 minutes per IP
// - Configurable via environment variables
```

---

## CI/CD Pipeline

### Automated Pipeline

| **Stage** | **Actions** | **Triggers** |
|:---|:---|:---|
| **Quality** | ESLint, Prettier | Push, PR |
| **Testing** | Unit, Integration, Coverage | Push, PR |
| **Security** | npm audit | Push, PR |
| **Build** | Docker build + test | Push, PR |
| **Deploy** | Production deployment | Tag: prod/v* |

### Pipeline Configuration

- **Location**: `.github/workflows/`
- **ci.yml**: Quality, testing, security, build
- **deploy.yml**: Production deployment

---

## Available Commands

### Development

```bash
make dev              # Start development server
make start            # Start production server
make test             # Run all tests
make lint             # Lint code
make format           # Format code
make clean            # Clean temp files
```

### Docker

```bash
make docker-build     # Build Docker image
make docker-run       # Run container
make docker-stop      # Stop container
make docker-logs      # View logs
```

### CI/CD

```bash
make ci               # Run CI locally
make create-prod-tag VERSION=1.0.0  # Create release tag
```

---

## API Documentation

### Main Endpoints

| **Endpoint** | **Method** | **Description** |
|:---|:---:|:---|
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |
| `/api/v1/crypto/analysis` | GET | Crypto analysis |
| `/api/v1/crypto/graph/:symbol` | GET | Graph data |
| `/process_request` | GET | Legacy endpoint |

### API Examples

```bash
# Health check
curl http://localhost:3000/health

# Crypto analysis (new API)
curl "http://localhost:3000/api/v1/crypto/analysis?symbol=BTC&investment=1000"

# Graph data
curl http://localhost:3000/api/v1/crypto/graph/ETH

# Legacy endpoint (backward compatibility)
curl "http://localhost:3000/process_request?symbol=ETH&investment=500"
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "data": {
    "symbol": "BTC",
    "investment": 1000,
    "numberOfCoins": 0.05,
    "profit": 500,
    "growthFactor": 0.5,
    "lambos": 0.0025
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Symbol not found",
    "code": "SYMBOL_NOT_FOUND"
  }
}
```

---

## Project Structure

### Clean Domain-Driven Architecture

```
src/app/
├── domain/                   # Business domain
│   ├── controllers/          # Request handlers
│   │   └── crypto.controller.js
│   ├── services/             # Business logic
│   │   ├── crypto-analysis.service.js
│   │   ├── crypto-cache.service.js
│   │   ├── crypto-data.service.js
│   │   └── graph-builder.service.js
│   ├── repositories/         # Database access
│   │   ├── crypto-result.repository.js
│   │   ├── opening-average.repository.js
│   │   └── query-log.repository.js
│   ├── routes/               # API routes
│   │   └── crypto.routes.js
│   ├── schemas/              # Validation
│   │   └── crypto.schemas.js
│   ├── exceptions/           # Domain errors
│   │   └── crypto.exceptions.js
│   └── constants.js          # Domain constants
│
├── shared/                   # Shared infrastructure
│   ├── middleware/
│   │   ├── async-handler.middleware.js
│   │   ├── error-handler.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── security.middleware.js
│   │   ├── cors.middleware.js
│   │   ├── health.middleware.js
│   │   └── auth.middleware.js
│   ├── config/
│   │   └── app.config.js
│   └── utils/
│       ├── logger.js
│       └── response.util.js
│
├── database/                 # Database layer
│   ├── sequelize.js
│   └── models/
│       ├── result.model.js
│       ├── opening-average.model.js
│       └── query-log.model.js
│
├── app.js                    # Express app factory
├── router.js                 # Central router
└── server.js                 # HTTP server
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|:---|:---:|:---|
| `NODE_ENV` | development | Environment mode |
| `PORT` | 3000 | Server port |
| `JWT_SECRET` | - | JWT secret (required in prod) |
| `DB_PATH` | ./data/database.sqlite | Database path |
| `ALLOWED_ORIGINS` | * | CORS origins |
| `RATE_LIMIT_MAX` | 100 | Max requests per window |
| `LOG_LEVEL` | info | Logging level |

---

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t dwml-backend-express:latest .

# Run container
docker run -d -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  dwml-backend-express:latest
```

### Production Checklist

- [ ] Set `JWT_SECRET` environment variable
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting
- [ ] Setup monitoring
- [ ] Configure logging
- [ ] Setup backup for database
- [ ] Enable HTTPS

---

## Monitoring

### Health Endpoints

| **Endpoint** | **Purpose** | **Response** |
|:---|:---|:---|
| `/health` | Basic health check | Status, uptime, version |
| `/ready` | Readiness check | Database connection status |

### Logging

- **Winston** for structured logging
- Log levels: error, warn, info, http, debug
- Logs written to: `logs/error.log`, `logs/combined.log`
- Configurable via `LOG_LEVEL` environment variable

---

## Troubleshooting

<details>
<summary><b>Dependencies Installation Fails</b></summary>

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><b>Database Connection Issues</b></summary>

```bash
# Check database path
ls -la ./data/

# Ensure directory exists
mkdir -p ./data

# Reset database (development only)
rm -f ./data/database.sqlite
```

</details>

<details>
<summary><b>Tests Failing</b></summary>

```bash
# Run with verbose output
npm test -- --verbose

# Run specific test
npm test tests/unit/services/crypto-analysis.service.test.js
```

</details>

---

## Contributing

### How to Contribute

1. **Fork & Clone**
2. **Create Branch**: `git checkout -b feature/your-feature`
3. **Make Changes**: Follow code style
4. **Run Tests**: `make test`
5. **Lint Code**: `make lint`
6. **Submit PR**

### Code Standards

- ✅ ESLint (Airbnb style guide)
- ✅ Prettier formatting
- ✅ 75%+ test coverage
- ✅ JSDoc comments
- ✅ Meaningful commit messages

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Express.js**

</div>
