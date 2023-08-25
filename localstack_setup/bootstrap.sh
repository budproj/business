#!/usr/bin/env bash

set -euo pipefail

echo "configuring sns/sqs"
echo "==================="
# https://gugsrs.com/localstack-sqs-sns/
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1
LOCALSTACK_DUMMY_ID=000000000000

create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --output text
}

create_topic() {
    local TOPIC_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME_TO_CREATE} --output text
}

guess_queue_arn_from_name() {
    local QUEUE_NAME=$1
    echo "arn:aws:sns:${AWS_REGION}:${LOCALSTACK_DUMMY_ID}:$QUEUE_NAME"
}

link_queue_and_topic() {
    local TOPIC_ARN_TO_LINK=$1
    local QUEUE_ARN_TO_LINK=$2
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${TOPIC_ARN_TO_LINK} --protocol sqs --notification-endpoint ${QUEUE_ARN_TO_LINK} --output table
}

ASSIGN_TASK_QUEUE="assign-task"
FULFILLER_QUEUE="fulfiller_task"
FULFILL_ANSWER_RETROSPECTIVE_TASK_TOPIC="answer-retrospective"
        
echo "creating topic $FULFILL_ANSWER_RETROSPECTIVE_TASK_TOPIC"
FULFILLER_TOPIC_ARN=$(create_topic ${FULFILL_ANSWER_RETROSPECTIVE_TASK_TOPIC})
echo "created topic: $FULFILLER_TOPIC_ARN"
        
echo "creating queue $FULFILLER_QUEUE"
FULFILLER_QUEUE_URL=$(create_queue ${FULFILLER_QUEUE})
echo "created queue: $FULFILLER_QUEUE_URL"
FULFILLER_QUEUE_ARN=$(guess_queue_arn_from_name $FULFILLER_QUEUE)

echo "creating queue $ASSIGN_TASK_QUEUE"
ASSIGN_TASK_QUEUE_URL=$(create_queue ${ASSIGN_TASK_QUEUE})
echo "created queue: $ASSIGN_TASK_QUEUE_URL"
        
echo "linking topic $FULFILLER_TOPIC_ARN to queue $FULFILLER_QUEUE_ARN"
LINKING_RESULT=$(link_queue_and_topic $FULFILLER_TOPIC_ARN $FULFILLER_QUEUE_ARN)
echo "linking done:"
echo "$LINKING_RESULT"
