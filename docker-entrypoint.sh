#!/bin/sh

PUID=${PUID:-911}
PGID=${PGID:-911}

groupmod -o -g "$PGID" app
usermod -o -u "$PUID" app

chown -R app:app /app
chown -R app:app /usr/src/app

su -s /bin/bash -c 'id' app

exec gosu app "$@"