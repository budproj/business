#!/usr/bin/env bash

set -euo pipefail

echo "configuring sns/sqs"
echo "==================="
# https://gugsrs.com/localstack-sqs-sns/
LOCALSTACK_HOST=localhost
AWS_REGION=sa-east-1


create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --output text
}

ASSIGN_TASK_QUEUE="assign-task"


echo "creating queue $ASSIGN_TASK_QUEUE"
ASSIGN_TASK_QUEUE_URL=$(create_queue ${ASSIGN_TASK_QUEUE})
echo "created queue: $ASSIGN_TASK_QUEUE_URL"
        
