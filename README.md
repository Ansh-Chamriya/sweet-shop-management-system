# Sweet Shop Management System

A comprehensive management system for sweet shops built as a pnpm monorepo.

## Project Structure

```
sweet-shop-management-system/
├── apps/               # Frontend and backend applications
├── packages/           # Shared libraries and utilities
├── package.json        # Root package.json
└── pnpm-workspace.yaml # Workspace configuration
```

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- pnpm (>=8.0.0)

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

```bash
# Run development servers for all applications
pnpm dev

# Build all packages and applications
pnpm build

# Run tests across all packages and applications
pnpm test
```

## Adding New Packages

To add a new shared package:

```bash
mkdir -p packages/package-name
cd packages/package-name
pnpm init
```

To add a new application:

```bash
mkdir -p apps/app-name
cd apps/app-name
pnpm init
```

## Workspace Commands

- `pnpm -r build` - Build all packages
- `pnpm -r dev` - Start development mode for all packages
- `pnpm -r test` - Run tests for all packages
- `pnpm --filter <package-name> <command>` - Run a command for a specific package
