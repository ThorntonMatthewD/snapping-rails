#!/bin/bash

cd ../../web

nvm use default
npm ci && npm run build:production

cd ..
docker-compose up -d --build --no-deps api web nginx
