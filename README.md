# mobile-wallet-document-builder

## Overview

A service for filling in the content of documents, storing them and, through integration with a wallet credential issuer, providing the links needed to load those documents into the GOV.UK Wallet.

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (>= 20.11.1)
- [NPM](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Homebrew](https://brew.sh)

We recommend using [nvm](https://github.com/nvm-sh/nvm) to install and manage Node.js versions.

To install nvm, run:
```
brew install nvm
```

Then, to install and use the required version of node using nvm, run the following commands:
```
nvm install
```

```
nvm use
```

## Quickstart

### Install

Install the dependencies with:
```
npm install
```

### Lint & Format

Lint and format the code with:
```
npm run lint
```

```
npm run format
```

### Build

Build the assets with:
```
npm run build
```

### Test

Unit test the code with:
```
npm run test
```

### Configure to Run Locally

#### Create a .env file

Create a copy of the example environment variable file:
```
cp .env.example .env
```

#### Set up LocalStack

This app uses LocalStack to run AWS services (DynamoDB, S3 and KMS) locally on port `4561`.
To start the LocalStack container and emulate the services, run:
```
npm run localstack:up
```

#### Set up the authorization server stub

Running locally requires running this application together with a stub of the authorization server, such 
as [this one](https://github.com/govuk-one-login/mobile-platform-back/tree/main/auth-stub).

To configure this stub to work with the Document Builder, run:
```
bash configure_auth_stub.sh
```

Both repositories must be in the same directory for the script to work.

### Run

To start the application, run:
```
npm run start
```

To start in development mode, run:
```
npm run dev
```

## Deploy application to `dev`

> You must be logged into the Mobile Platform `dev` AWS account.

You can deploy the application to the `dev` AWS account by following these steps:

### Store the OIDC Client ID

Before a stack is deployed for the first name, an SSM parameter must be created to hold the OIDC client ID:

```shell
aws ssm put-parameter --name "/<your-stack-name>/Config/OIDC/Client/Id" --value "TEST_CLIENT_ID" --type String
```
The usual non-production deployment client ID is `TEST_CLIENT_ID`.

### Build and push the docker image

Run the script to build and push the Document Builder docker image, specifying an image tag and the name of your AWS profile
for the Mobile Platform `dev` AWS account (which can be found in your `~/.aws/credentials` file):

```shell
./build-and-deploy-image.sh <your-chosen-tag> <your-mobile-platform-dev-profile> 
```

This will build the docker image, log into ECR, push the image to ECR, and update the `template.yaml` to specify this
image for the Document Builder ECS task.

### Update the SAM template

If using your own deployed version of the [Example CRI](https://github.com/govuk-one-login/mobile-wallet-example-credential-issuer) 
and [Auth Stub](https://github.com/govuk-one-login/mobile-platform-back/tree/main/auth-stub), the following mapping values in the template must be updated:

 ```yaml
 Mappings:
   EnvironmentVariables:
     dev:
       CredentialIssuerUrl: "<your-cri-stack-name->example-credential-issuer.mobile.dev.account.gov.uk"
       OidcIssuerEndpoint: "https://<your-auth-stub-stack-name->.mobile.dev.account.gov.uk"
 ```

### Build and deploy the stack

```
sam build && sam deploy --capabilities CAPABILITY_IAM --stack-name <your_stack_name>
```
