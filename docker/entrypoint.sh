#!/bin/sh

# Replace environment variables in nginx config
envsubst '$API_BASE_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'