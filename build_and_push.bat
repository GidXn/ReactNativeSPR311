@echo off

echo Changing directory api...
cd "MyAPI"

echo Building Docker image api...
docker build -t spr311-api .

echo Docker login...
docker login

echo Tagging Docker image api...
docker tag spr311-api:latest GidXn/spr311-api:latest

echo Pushing Docker image api to repository...
docker push GidXn/spr311-api:latest

echo Done ---api---!
pause

