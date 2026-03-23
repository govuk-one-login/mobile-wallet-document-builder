# Mobile Wallet Document Builder

## Overview

A service for creating and storing test documents used by the GOV.UK Wallet credential issuer to issue the corresponding digital credentials. Once a document is created, the service displays the credential offer returned by the issuer, which can then be consumed by GOV.UK Wallet.

## Tech Stack

This service is built with TypeScript and Node.js/Express, using Nunjucks for server-side templating, containerised with Docker, and deployed to ECS Fargate behind an API Gateway. It uses DynamoDB and S3 for storage and KMS for signing and encryption, with infrastructure managed via AWS SAM.

## Prerequisites

- [Node.js](https://nodejs.org/en) — we recommend managing versions with [nvm](https://github.com/nvm-sh/nvm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — required to run LocalStack locally and to build the app image

## Local Setup

### Install

```bash
npm install
```

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce checks before commits and pushes.

```bash
npm run setup-hooks
```

**Before each commit**, the following run automatically:

```bash
npm run lint
npm run format:check
```

Commit messages are validated against the [Conventional Commits](https://github.com/conventional-changelog/commitlint) standard — non-conforming messages will be rejected.

**Before each push**, the following runs automatically:

```bash
npm run test
```

### Lint & Format

```bash
npm run lint:fix
npm run format
```

### Build

```bash
npm run build
```

### Run

Create a local environment file:

```bash
cp .env.example .env
```

Start LocalStack to emulate AWS services (DynamoDB, S3, KMS) on port `4561`:

```bash
npm run localstack:up
```

Running locally also requires an authorization server stub, such as [this one](https://github.com/govuk-one-login/mobile-platform-back/tree/main/auth-stub). To configure it to work with the Document Builder, run:

```bash
./configure_auth_stub.sh <your_aws_profile>
```

> Both repositories must be in the same parent directory for this script to work.

Start the application:

```bash
npm run start       # production mode
npm run dev         # development mode with hot reload
```

The service will be available at [http://localhost:8001/start](http://localhost:8001/start).

### Test

```bash
npm run test
```

## Deployment

This service is deployed via GitHub Actions.

Automated deployments to `build` are triggered on push to `main` after PR approval. Manual deployments to `dev` can be triggered from the GitHub Actions menu, where you can specify a branch name or commit SHA.

## Contributing

Ensure your branch is up to date and all pre-commit hooks pass before opening a pull request. Avoid using `--no-verify` to bypass them unless absolutely necessary.
