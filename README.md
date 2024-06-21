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

#### Setting up with an auth server stub
To test locally with an app that requires the user to be logged in (e.g. staging app), you will need to run this application together with a stub of the auth server.

In the `.env` file, update the values of the following environment variables:
- `OIDC_CLIENT_ID`: test client ID required by the auth server's stub
- `OIDC_ISSUER_DISCOVERY_ENDPOINT`: auth server's stub endpoint

When LocalStack is started, it creates the client's signing key in KMS. You will need to give the auth server stub the client's public key. This can be retrieved from local KMS by running these commands:
```
aws kms get-public-key --endpoint-url=http://localhost:4561 --region eu-west-2 --key-id alias/localClientSigningKeyAlias --output text --query PublicKey | base64 --decode > SamplePublicKey.der

openssl ec -pubin -inform DER -outform PEM -in SamplePublicKey.der -pubout -out SamplePublicKey.pem
```

#### Running the Application
Run the application with:
```
npm run start
```

To run the application in development mode with nodemon watching the files, run:
```
npm run dev
```

#### Start URL & Endpoints

To start and test the credential offer endpoint, go to:

[http://localhost:8888/select-app](http://localhost:8888/select-app)

To get a document's details, hit the following endpoint:

[http://localhost:8888/document/:documentId](http://localhost:8888/document/:documentId)

To swap a pre-authorized code for an access token (STS Stub):
```
curl -d "grant_type=urn:ietf:params:oauth:grant-type:pre-authorized_code&pre-authorized_code=eyJraWQiOiJmZjI3NWI5Mi0wZGVmLTRkZmMtYjBmNi04N2M5NmIyNmM2YzciLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJ1cm46ZmRjOmdvdjp1azp3YWxsZXQiLCJjbGllbnRJZCI6IkVYQU1QTEVfQ1JJIiwiaXNzIjoidXJuOmZkYzpnb3Y6dWs6ZXhhbXBsZS1jcmVkZW50aWFsLWlzc3VlciIsImNyZWRlbnRpYWxfaWRlbnRpZmllcnMiOlsiYmYyODVjOTctMzFkNS00NGEwLWFkZGQtNDNmM2I0YmIzYmMwIl0sImV4cCI6MTcxMjMwNDMwOCwiaWF0IjoxNzEyMzA0MDA4fQ.2-qE4IKUJpUPo04O4m34W13o8f8V6zNuuJ0RBoSyPcBTZFtuJVTHM_4lhiGrOH9vysS8LxTYSSeyv7FugH4RJw" -X POST http://localhost:8888/sts-stub/token | jq
```

To get the did:web document (STS Stub):
```
curl -X GET http://localhost:8888/sts-stub/.well-known/did.json | jq
```


#### Reading from the Database
To check that an item was saved to the DynamoDB **documents** table, run `aws --endpoint-url=http://localhost:4561 --region eu-west-2 dynamodb query --table-name documents --key-condition-expression "documentId = :documentId" --expression-attribute-values "{ \":documentId\" : { \"S\" : \"86bd9f55-d675-4a16-963a-56ac17c8597c\" } }"`, replacing the **documentId** with the relevant one.

To return all items from the **documents** table, run `aws --endpoint-url=http://localhost:4561 --region eu-west-2 dynamodb scan --table-name documents`.

## Test
Run the following command to run the unit tests:
```
npm run test
```
Jest is test runner, and it is configured in [jest.config.ts](./jest.config.ts).
