#!/bin/sh

export TABLE_NAME=documents

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=documentId,AttributeType=S \
    --key-schema AttributeName=documentId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --region eu-west-2

aws --endpoint-url=http://localhost:4566 kms create-key \
    --region eu-west-2 \
    --key-usage SIGN_VERIFY \
    --key-spec RSA_4096 \
    --tags '[{"TagKey":"_custom_id_","TagValue":"2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7"}]'

aws --endpoint-url=http://localhost:4566 kms create-alias \
    --region eu-west-2 \
    --alias-name alias/localStsSigningKeyAlias \
    --target-key-id 2ced22e2-c15b-4e02-aa5f-7a10a2eaccc7
