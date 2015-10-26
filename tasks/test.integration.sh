#!/bin/env bash

# pull images
gcloud docker pull eu.gcr.io/saio-fr/crossbar:master

# install
docker build -t customer-service -f Dockerfile .;
docker build -t customer-test -f tasks/integration/Dockerfile .;

# start services
echo "starting database server...";
docker run -d \
	--name customer-db \
	memsql/quickstart;
sleep 20;

echo "creating databases...";
docker exec -d customer-db memsql-shell -e \
"create database customer;";
sleep 20;

echo "starting crossbar...";
docker run -d \
  --name customer-crossbar \
  eu.gcr.io/saio-fr/crossbar:master;
sleep 20;

echo "starting customer service...";
docker run -d \
  --name customer-service \
  --link customer-db:db \
  --link customer-crossbar:crossbar \
  customer-service;
sleep 20;

echo "running test...";
docker run \
  --name customer-test \
  --link customer-db:db \
  --link customer-crossbar:crossbar \
  customer-test;
TEST_EC=$?;

# return with the exit code of the test
if [ $TEST_EC -eq 0 ]
then
  echo "It Saul Goodman !";
  exit 0;
else
  exit $TEST_EC;
fi
