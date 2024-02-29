#!/bin/sh

export TABLE_NAME=user_documents

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=document_id,AttributeType=S \
    --key-schema AttributeName=document_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --region eu-west-2

aws --endpoint-url=http://localhost:4566 dynamodb put-item \
    --table-name $TABLE_NAME  \
    --region eu-west-2 \
    --item '
    {
      "document_id": {
        "S":  "test_id"
      }
    }'
