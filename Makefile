.PHONY: help install install-dev test lint format clean docker-build docker-run

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install production dependencies
	npm ci --production

install-dev: ## Install development dependencies and setup pre-commit hooks
	npm ci
	npx husky install
	@echo "✅ Development environment ready"

test: ## Run all tests with coverage
	npm test

test-unit: ## Run unit tests
	npm run test:unit

test-integration: ## Run integration tests
	npm run test:integration

test-e2e: ## Run end-to-end tests
	npm run test:e2e

test-watch: ## Run tests in watch mode
	npm run test:watch

lint: ## Run linting checks
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check code formatting
	npm run format:check

security-check: ## Run security audit
	npm run security:check

clean: ## Clean temporary files and dependencies
	rm -rf node_modules coverage dist logs/*.log
	rm -rf .jest-cache

dev: ## Run development server
	npm run dev

prod: ## Run production server
	npm start

docker-build: ## Build Docker image
	docker build -t dwml-backend-express:latest .

docker-run: ## Run Docker container
	docker-compose up -d

docker-stop: ## Stop Docker container
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

ci: ## Run CI pipeline locally
	make lint
	make test
	make security-check
	make docker-build

create-prod-tag: ## Create production release tag (usage: make create-prod-tag VERSION=1.0.0)
	@if [ -z "$(VERSION)" ]; then \
		echo "Error: VERSION is required. Usage: make create-prod-tag VERSION=1.0.0"; \
		exit 1; \
	fi
	git tag -a prod/v$(VERSION) -m "Release v$(VERSION)"
	git push origin prod/v$(VERSION)
	@echo "✅ Created and pushed tag: prod/v$(VERSION)"

