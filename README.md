# mobile-wallet-document-builder
## Overview

A service for filling in the content of documents, storing them and, through integration with a wallet credential issuer, providing the links needed to load those documents into the GOV.UK Wallet.

## Pre-requisites

- node >= v20.0.0
- [Homebrew package manager](https://brew.sh)
- [Docker](https://docs.docker.com/get-docker/) 
- [docker-compose](https://docs.docker.com/compose/install/) (version 1.9.0+)

If you don't have node, or don't have a recent enough version installed:

The project has been configured with nvm (node version manager). You can use this to install the right version of node.

To install nvm, run:
```
brew install nvm
```

To switch to the required version of node using nvm, run:
```
nvm install
nvm use
```

## Quickstart

### Installation
Install node dependencies:
```
npm install
```

### Configure
Create a copy of the example environment variable file:
```
cp .env.example .env
```

### Build
Build the assets:
```
npm run build
```

### Run
This app uses LocalStack to run AWS services locally. To start the LocalStack container and provision a local version of the **documents** DynamoDB table, run the command:
```
docker-compose up
```

Then run the following command to start the application:
```
npm run start
```
The application should be running on port 8000.

Open http://localhost:8000/credential_offer in a web browser.

To check that an item was saved to the DynamoDB **documents** table, run the following command in the terminal (replacing first the `documentId` in the command):

```
aws --endpoint-url=http://localhost:4566 --region eu-west-2 dynamodb query --table-name documents --key-condition-expression "documentId = :documentId" --expression-attribute-values "{ \":documentId\" : { \"S\" : \"86bd9f55-d675-4a16-963a-56ac17c8597c\" } }"
```

## Test

Run the following command to run the unit tests:
```
npm run test
```
Jest is test runner, and it is configured in [jest.config.ts](./jest.config.ts).
