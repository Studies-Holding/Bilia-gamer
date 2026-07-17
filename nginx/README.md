# nginx/

Config edge (reverse proxy, TLS en staging/prod, cf. AFG-DT-001 §7) devant le `gateway` applicatif (`services/gateway`,
port 5000). `nginx.conf` est la config **dev** (docker-compose, HTTP, port 8080 → gateway:5000, pas de TLS).

Une config staging/prod séparée (TLS, rate-limit edge, plusieurs upstreams) est attendue en `infra/` à partir du
Lot 2+ (cf. AFG-DT-003).
