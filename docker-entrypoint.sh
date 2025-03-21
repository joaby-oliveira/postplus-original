#!/bin/sh

# Esperar o PostgreSQL estar pronto
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL is ready!"

# Executar migrações
echo "Running database migrations..."
npx prisma migrate deploy

# Executar o comando passado
exec "$@" 