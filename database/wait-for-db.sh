until pg_isready -U postgres; do
  echo >&2 "$(date +%Y%m%dt%H%M%S) Postgres is unavailable - sleeping"
  sleep 2
done
echo >&2 "$(date +%Y%m%dt%H%M%S) Postgres is up - Proceed with seeding!"