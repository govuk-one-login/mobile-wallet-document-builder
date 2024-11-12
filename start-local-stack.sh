#!/bin/bash
set -eu

# Start stub credential issuer
echo "Updating environment variables used by localstack to point to locally running servers"
sed -i "" "s|example-credential-issuer.mobile.dev.account.gov.uk|http://localhost:8080|" deploy/template.yaml
sed -i "" "s|https://auth-stub.mobile.dev.account.gov.uk|http://localhost:8000|" deploy/template.yaml

docker compose up