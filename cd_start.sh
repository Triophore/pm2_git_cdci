#!/bin/sh

echo "Starting script"

cd /root/athena_server/ && git config --global pull.ff true && npm install && pm2 restart 2