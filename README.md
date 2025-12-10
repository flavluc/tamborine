# Tamborine - Transaction Management System

A full-stack transaction management application built with modern technologies. This project demonstrates a complete monorepo setup with API, web interface, and shared packages.

## Project Overview

Tamborine is a transaction processing system that allows users to:

- Register and authenticate securely
- Submit transactions for authorization
- View transaction history with filtering and pagination

## Architecture

This is a Turborepo monorepo containing:

### Applications

- **`apps/api`**: REST API server built with Fastify
  - JWT-based authentication with access and refresh tokens
  - MongoDB integration with Mongoose ODM
  - Transaction processing and authorization logic
  - Comprehensive test suite (unit and integration tests)

- **`apps/web`**: Next.js 16 web application
  - React 19 with Server Components
  - TanStack Query for data fetching
  - Tailwind CSS + shadcn/ui components
  - Authentication flow with protected routes

### Packages

- **`@repo/schemas`**: Shared Zod validation schemas
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: TypeScript configurations
- **`@repo/jest-presets`**: Jest test configurations

### Structure

```
tamborine/
├── apps/
│   ├── api/              # Fastify API
│   │   ├── src/
│   │   │   ├── config/   # Env configuration
│   │   │   ├── core/     # Authorization rules
│   │   │   ├── models/   # Mongoose models
│   │   │   ├── plugins/  # Fastify plugins
│   │   │   ├── routes/   # API route handlers
│   │   │   ├── services/ # Business logic
│   │   │   └── utils/    # Utilities
│   │   └── test/         # Tests
│   └── web/              # Next.js app
│       └── src/
│           ├── app/      # App Router pages
│           ├── components/ # React components
│           └── lib/      # Utilities
├── packages/
│   ├── schemas/          # Shared Zod schemas
│   ├── config-eslint/    # ESLint configs
│   ├── config-typescript/ # TS configs
│   └── jest-presets/     # Jest configs
├── docker-compose.yml    # Docker orchestration
├── flake.nix            # Nix development environment
└── turbo.json           # Turborepo configuration
```

## Technology Stack

### Backend

- **Fastify** - High-performance web framework
- **MongoDB** - Document database with Mongoose ODM
- **JWT** - Token-based authentication
- **Zod** - Runtime type validation
- **Jest** - Testing framework with Testcontainers

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with React Compiler
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library

### Development Tools

- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **TypeScript** - Type-safe development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nix** - Reproducible development environment

## Quick Start with Docker

The easiest way to run the application is using Docker Compose.

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tamborine
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` or use the commited defaults for local development.

3. **Start the application**

   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Web App: http://localhost:3000
   - API: http://localhost:3001
   - MongoDB: localhost:27017

5. **Create an account**
   - Navigate to http://localhost:3000
   - Click "Register" and create a new account
   - Start creating transactions

### Docker Compose Services

- **mongodb**: MongoDB 7 database with persistent volume
- **api**: Fastify API server (production build)
- **web**: Next.js web application (production build)

All services are networked together and will restart automatically unless stopped.

## Local Development Setup

For development without Docker:

### Prerequisites

This project includes a Nix flake for reproducible development environments. If you have nix installed or use nixos, just run:

```bash
nix develop
```

Otherwise install the following dependencies with your favorite package manager:

- Node.js 18+ (recommended: 22)
- pnpm 8.15.6+
- MongoDB 7+

### Steps

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up MongoDB**

   Start MongoDB locally:

   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Linux with systemd
   sudo systemctl start mongod

   # Or run with Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

3. **Configure environment variables**

   Create `.env` for each app:

   ```bash
   #apps/api/.env
   DATABASE_URL=mongodb://localhost:27017/tamborine
   JWT_ACCESS_SECRET=your-access-secret-here-min-16-chars
   WEB_URL=http://localhost:3000
   ```

   ```bash
   #apps/web/.env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development servers**

   In the project root:

   ```bash
   pnpm dev
   ```

   This will start:
   - API server at http://localhost:3001
   - Web app at http://localhost:3000

   Both will hot-reload on file changes.

## Testing

The API includes comprehensive tests using Jest and Testcontainers.

```bash
# Run tests
pnpm test
```

Test coverage includes:

- Unit tests for core authorization logic
- Integration tests for API endpoints
- Database tests using MongoDB Testcontainers

## API Overview

The API provides the following endpoints:

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and clears JWT tokens

### Transactions

- `POST /transactions` - Create a new transaction (authenticated)
- `GET /transactions` - List transactions with pagination and filtering (authenticated)

### Operations

- `GET /ops/healthz` - Health check endpoint
- `GET /ops/readyz` - Readiness check endpoint

All authenticated endpoints require a Bearer token in the Authorization header.

## Future Improvements

- **Centralized error handling**
  - Single error abstraction across API layers (Zod, Fastify, Mongoose).
  - Consistent error envelopes with machine-readable error codes.
  - Clear separation between internal errors and client-safe messages.

- **API documentation with Fastify Swagger**
  - OpenAPI specification generated directly from route schemas.
  - Interactive Swagger UI for exploration and manual testing.
  - Versioned API documentation to support future breaking changes.

- **Transaction authorization code collision handling**
  - Database-level uniqueness constraints on authorization codes.
  - Strategy to handle collision.

- **Rate limiting**
  - Per-IP and per-user rate limits on authentication routes.
  - Protection against brute-force login attempts and API abuse.

- **Audit logging**
  - Immutable audit trail for authentication and transaction events.
  - Separation between audit logs and application logs.

- **Role-Based Access Control (RBAC)**
  - Introduction of roles (e.g. user, admin, support).
  - Restricted access to sensitive endpoints and operational routes.

- **Observability**
  - Structured logging with request and correlation IDs.
  - Metrics for latency, error rates, and authentication failures.
  - Health and readiness checks tied to real dependencies.

- **CI/CD enhancements**
  - Automated pipelines enforcing tests, linting, and type checks.
  - Docker image builds with vulnerability scanning.
