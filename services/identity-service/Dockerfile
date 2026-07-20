FROM node:22-alpine AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile && pnpm --filter identity-service run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/services/identity-service/dist ./dist
COPY --from=build /app/services/identity-service/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 5001
CMD ["node", "dist/index.js"]
