#!/bin/sh

export TABLE_NAME=documents

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=documentId,AttributeType=S \
    --key-schema AttributeName=documentId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --region eu-west-2