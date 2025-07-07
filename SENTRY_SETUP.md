# Sentry Setup for Packmind Monorepo

This document describes the Sentry integration setup for the Packmind monorepo applications.

## Applications with Sentry Integration

### 1. Frontend (Next.js App)
- **Location**: `apps/frontend/`
- **Sentry Package**: `@sentry/nextjs`
- **Configuration Files**:
  - `sentry.client.config.ts` - Client-side configuration
  - `sentry.server.config.ts` - Server-side configuration
  - `next.config.js` - Next.js configuration with Sentry webpack plugin

### 2. MCP Server (Node.js App)
- **Location**: `apps/mcp-server/`
- **Sentry Package**: `@sentry/node`
- **Port**: 3001
- **Configuration**: Integrated in `src/main.ts`

### 3. API Server (Node.js App)
- **Location**: `apps/api/`
- **Sentry Package**: `@sentry/node`
- **Port**: 3000
- **Configuration**: Integrated in `src/main.ts`
- **Database**: MongoDB (optional)

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```env
# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Environment
NODE_ENV=development

# API Configuration
PORT=3000
MCP_SERVER_PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/packmind
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Sentry configuration
```

3. Build all applications:
```bash
npm run build
```

## Running the Applications

### Development Mode
```bash
# Run all applications
npm run dev

# Or run individually
nx serve frontend
nx serve mcp-server
nx serve api
```

### Production Mode
```bash
# Build all applications
npm run build

# Run all applications
npm run start
```

## Sentry Features Configured

### Frontend (Next.js)
- **Error Boundary**: Automatic error capture on both client and server
- **Performance Monitoring**: Tracing for page loads and API calls
- **Session Replay**: User session recording (10% sample rate)
- **Source Maps**: Automatic source map upload during build
- **Test Error Route**: Visit `/` and click "Test Sentry Error" button

### Backend (Node.js Apps)
- **Error Tracking**: Automatic error capture with stack traces
- **Performance Monitoring**: HTTP request tracing
- **Profiling**: CPU profiling for performance optimization
- **Express Integration**: Middleware for request/response tracking
- **Test Error Routes**: 
  - API: `GET /api/test-error`
  - MCP Server: `GET /test-error`

## Testing Sentry Integration

### Frontend
1. Start the frontend: `nx serve frontend`
2. Visit `http://localhost:4200`
3. Click "Test Sentry Error" button
4. Check Sentry dashboard for the error

### API Server
1. Start the API server: `nx serve api`
2. Visit `http://localhost:3000/api/test-error`
3. Check Sentry dashboard for the error

### MCP Server
1. Start the MCP server: `nx serve mcp-server`
2. Visit `http://localhost:3001/test-error`
3. Check Sentry dashboard for the error

## Sentry Project Configuration

### Recommended Settings
1. **Error Sampling**: 100% for development, 10-25% for production
2. **Performance Sampling**: 100% for development, 1-10% for production
3. **Session Replay**: 10% for production
4. **Alerts**: Set up alerts for error spikes and performance degradation

### Release Management
The configuration includes automatic release detection based on:
- Git commit SHA
- Environment variables
- Package.json version

## Troubleshooting

### Common Issues
1. **DSN Not Found**: Ensure `SENTRY_DSN` is set correctly
2. **Source Maps**: Ensure `SENTRY_AUTH_TOKEN` is set for upload
3. **Performance**: Reduce sampling rates in production
4. **CORS**: Ensure frontend can communicate with backend APIs

### Debug Mode
Set `NODE_ENV=development` to enable debug logging for Sentry.