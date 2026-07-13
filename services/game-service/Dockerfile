FROM node:20-alpine

WORKDIR /app

# Dépendances d'abord (layer cache)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Sources compilées
COPY . .
RUN npm run build

# Sécurité — utilisateur non-root
RUN addgroup -S bilia && adduser -S bilia -G bilia
USER bilia

EXPOSE 5003

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:5003/health || exit 1

CMD ["node", "dist/index.js"]
