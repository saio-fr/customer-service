#!/bin/env bash

# pull images
gcloud docker pull eu.gcr.io/saio-fr/crossbar:master

# install
docker build -t customer-service -f Dockerfile .;
docker build -t customer-test -f tasks/integration/Dockerfile .;

# start services
echo "starting database...";
docker run -d \
	--name customer-db \
	-e POSTGRES_PASSWORD=test \
	postgres;
sleep 4;

echo "starting crossbar...";
docker run -d \
  --name customer-crossbar \
  eu.gcr.io/saio-fr/crossbar:master;
sleep 4;

echo "starting customer service...";
docker run -d \
  --name customer-service \
  --link customer-db:db \
  --link customer-crossbar:crossbar \
  customer-service;
sleep 4;

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
