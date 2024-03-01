# mobile-wallet-document-builder
## Overview

A service for filling in the content of documents, storing them and, through integration with a wallet credential issuer, providing the links needed to load those documents into the GOV.UK Wallet.

## Pre-requisites

- node >= v20.0.0
- [Homebrew package manager](https://brew.sh)

If you don't have node, or don't have a recent enough version installed:
The project has been configured with nvm (node version manager). You can use this to install the right version of Node.

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

### Install dependencies
```
npm install
```

### Build
```
npm run build
```

### Run
#### Prerequisites
Running the app locally requires [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) (version 1.9.0+).

This app uses LocalStack to run AWS services locally. To start the LocalStack container and provision a local version of the **documents** DynamoDB table, run the following command:

```
docker-compose up
```

Then run the following command to start the application: 

```
npm run start
```

Visit `localhost:8000/credential_offer` to check the app is running as expected.


## Test

Run unit tests to test functionality of individual functions:
```
npm run test
```