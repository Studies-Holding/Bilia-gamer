FROM node:22-alpine AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile && pnpm --filter i18n-service run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/services/i18n-service/dist ./dist
COPY --from=build /app/services/i18n-service/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 5015
CMD ["node", "dist/index.js"]
