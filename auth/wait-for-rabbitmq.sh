#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

# Función para verificar la disponibilidad de RabbitMQ
rabbitmq_is_available() {
  nc -z "$host" 5672
}

# Espera a que RabbitMQ esté disponible
until rabbitmq_is_available; do
  >&2 echo "RabbitMQ is unavailable - sleeping"
  sleep 1
done

>&2 echo "RabbitMQ is up - executing command"
# Ejecuta el comando pasado como argumento
exec $cmd
