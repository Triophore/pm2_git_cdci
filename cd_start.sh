#!/bin/sh

echo "Starting script"

cd /root/athena_server/ && git pull && npm install && pm2 restart 2