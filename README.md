# mobile-wallet-document-builder
## Overview

A service for filling in the content of documents, storing them and, through integration with a wallet credential issuer, providing the links needed to load those documents into the GOV.UK Wallet.

## Pre-requisites

- node >= v20.0.0
- [Homebrew package manager](https://brew.sh)
- [Docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/) (version 1.9.0+)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

**If you don't have node, or don't have a recent enough version installed:**

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

### Linting
Lint and format the code:
```
npm run format
```

### Build
Build the assets:
```
npm run build
```

### Run

#### Setting up the AWS CLI
You will need to have the AWS CLI installed and configured to interact with the local database. You can configure the CLI with the values below by running `aws configure`:
```
AWS Access Key ID [None]: na
AWS Secret Access Key [None]: na
Default region name [None]: eu-west-2
Default output format [None]:
```

####  Setting up LocalStack
This app uses LocalStack to run AWS services locally on port `4561`.

To start the LocalStack container and provision a local version of the **documents** DynamoDB table, run `docker-compose up`.

You will need to have Docker Desktop or alternative like installed.

#### Running the Application
Run the application with:
```
npm run start
```

#### Start URL & Endpoints

To start and test the credential offer endpoint, go to:

[http://localhost:8000/build-document](http://localhost:8000/build-document)

To get a document's details, hit the following endpoint:

[http://localhost:8000/document/:documentId](http://localhost:8000/document/:documentId)


#### Reading from the Database
To check that an item was saved to the DynamoDB **documents** table, run `aws --endpoint-url=http://localhost:4561 --region eu-west-2 dynamodb query --table-name documents --key-condition-expression "documentId = :documentId" --expression-attribute-values "{ \":documentId\" : { \"S\" : \"86bd9f55-d675-4a16-963a-56ac17c8597c\" } }"`, replacing the **documentId** with the relevant one.

To return all items from the **documents** table, run `aws --endpoint-url=http://localhost:4561 --region eu-west-2 dynamodb scan --table-name documents`.

## Test
Run the following command to run the unit tests:
```
npm run test
```
Jest is test runner, and it is configured in [jest.config.ts](./jest.config.ts).
