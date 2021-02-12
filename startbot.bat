@echo off
Rem Start the Docker containers after building them fresh
Rem --abort-on-container-exit makes it so if one container exits, they both quit as gracefully as possible
Rem This is to clean up in case the Discord client stops due to a missing/invalid token, or if there's a database issue
docker-compose up --build --abort-on-container-exit