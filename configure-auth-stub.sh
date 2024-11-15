#!/bin/bash
set -eu

aws kms get-public-key --endpoint-url=http://localhost:4561 --region eu-west-2 --key-id alias/localClientSigningKeyAlias --output text --query PublicKey | base64 --decode > LocalClientSigningKey.der
openssl rsa -pubin -inform DER -outform PEM -in LocalClientSigningKey.der -pubout -out ../mobile-platform-back/auth-stub/src/client-keys/dev/document-builder-local.pem

sed -i "" "s|https://auth-stub.mobile.dev.account.gov.uk|http://localhost:8000|" ../mobile-platform-back/auth-stub/.env