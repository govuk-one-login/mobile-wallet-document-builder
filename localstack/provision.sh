#!/bin/sh

export TABLE_NAME=documents

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions AttributeName=documentId,AttributeType=S \
    --key-schema AttributeName=documentId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --region eu-west-2

aws --endpoint-url=http://localhost:4566 dynamodb put-item \
    --table-name $TABLE_NAME  \
    --region eu-west-2 \
    --item '
    {
      "documentId": {
        "S":  "86bd9f55-d675-4a16-963a-56ac17c8597c"
      },
      "walletSubjectId": {
           "S":  "test_wallet_subject_id"
      },
     "vc": {
          "S":  "test_vc"
      }
    }'
