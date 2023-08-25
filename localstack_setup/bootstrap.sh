#!/usr/bin/env bash

set -euo pipefail

function create_queue() {
    awslocal sqs create-queue --endpoint-url http://localhost:4566 --queue-name fulfill-task --region us-east-1 --output table
}

function create_topic() {
    awslocal sns create-topic --endpoint-url http://localhost:4566 --name answer-retrospective --region us-east-1 --output table
    
    awslocal sns create-topic --endpoint-url http://localhost:4566 --name check-in --region us-east-1 --output table
}

function subscribe() {
    awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:answer-retrospective --protocol sqs --notification-endpoint arn:aws:sns:us-east-1:000000000000:fulfill --region us-east-1 --output table

    awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:check-in --protocol sqs --notification-endpoint arn:aws:sns:us-east-1:000000000000:fulfill --region us-east-1 --output table
}

create_queue
create_topic
subscribe
