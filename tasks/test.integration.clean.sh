#!/bin/env bash

# stop
docker stop customer-service;
docker stop customer-crossbar;
docker stop customer-db;

# clean
docker rm customer-test;
docker rm customer-service;
docker rm customer-crossbar;
docker rm customer-db;

# uninstall
docker rmi customer-test;
docker rmi customer-service;
docker rmi customer-crossbar;
