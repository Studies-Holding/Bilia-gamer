#!/usr/bin/env node
/**
 * Gabarit de service (cf. docs/README.md "Chaque services/* suit le même
 * gabarit interne", AFG-DT-003 Lot 0). Génère un nouveau `services/<nom>`
 * avec app.ts (Express pur, testable via supertest) séparé de index.ts
 * (bootstrap), jest.config.js, Dockerfile, README.md, ROADMAP.md.
 *
 * Usage :
 *   pnpm new:service <nom> <port> ["description courte"]
 *   node scripts/create-service.mjs identity 5001 "Comptes, auth, profils, familles"
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

const [, , rawName, rawPort, ...descParts] = process.argv
if (!rawName || !rawPort) {
  console.error('Usage: pnpm new:service <nom> <port> ["description"]')
  process.exit(1)
}

const name = rawName.endsWith('-service') || rawName === 'gateway' ? rawName : `${rawName}-service`
const port = Number(rawPort)
const description = descParts.join(' ') || `Service ${name}.`
const serviceDir = path.join(rootDir, 'services', name)

if (existsSync(serviceDir)) {
  console.error(`services/${name} existe déjà — abandon.`)
  process.exit(1)
}

function write(relPath, content) {
  const full = path.join(serviceDir, relPath)
  mkdirSync(path.dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf-8')
}

// --- package.json ---
write(
  'package.json',
  JSON.stringify(
    {
      name,
      version: '0.1.0',
      private: true,
      description,
      type: 'module',
      main: './dist/index.js',
      scripts: {
        build: 'tsc -p tsconfig.json',
        dev: 'tsc -p tsconfig.json --watch & node --watch dist/index.js',
        start: 'node dist/index.js',
        lint: `echo "${name}: no linter configured yet"`,
        typecheck: 'tsc -p tsconfig.json --noEmit',
        test: 'cross-env NODE_OPTIONS=--experimental-vm-modules jest',
      },
      dependencies: {
        '@shared/core': 'workspace:*',
        '@bilia/contracts': 'workspace:*',
        express: '^4.21.2',
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/jest': '^29.5.14',
        '@types/node': '^24.13.2',
        '@types/supertest': '^6.0.2',
        'cross-env': '^7.0.3',
        jest: '^29.7.0',
        supertest: '^7.0.0',
        'ts-jest': '^29.2.5',
        typescript: '~6.0.2',
      },
    },
    null,
    2,
  ) + '\n',
)

// --- tsconfig.json ---
write(
  'tsconfig.json',
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: { outDir: './dist', rootDir: './src' },
      include: ['src'],
    },
    null,
    2,
  ) + '\n',
)

// --- jest.config.js ---
write(
  'jest.config.js',
  `/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\\\.{1,2}/.*)\\\\.js$': '$1',
  },
  transform: {
    '^.+\\\\.ts$': ['ts-jest', { useESM: true }],
  },
  testMatch: ['**/tests/**/*.test.ts'],
}
`,
)

// --- src/logger.ts ---
write(
  'src/logger.ts',
  `import { createLogger, type Logger } from '@shared/core/logger'

export const logger: Logger = createLogger({ serviceName: '${name}' })
`,
)

// --- src/config/index.ts ---
write(
  'src/config/index.ts',
  `export const config = {
  port: Number(process.env.PORT ?? ${port}),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
`,
)

// --- src/routes/index.ts ---
write(
  'src/routes/index.ts',
  `import { Router, type Router as ExpressRouter } from 'express'

export const routes: ExpressRouter = Router()

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: '${name}' })
})
`,
)

for (const dir of ['controllers', 'services', 'models', 'events', 'middleware', 'utils']) {
  write(`src/${dir}/.gitkeep`, '')
}

// --- src/app.ts ---
write(
  'src/app.ts',
  `import express, { type Express } from 'express'
import { httpLogger } from '@shared/core/httpLogger'
import { errorHandler } from '@shared/core/middleware/errorHandler'
import { logger } from './logger.js'
import { routes } from './routes/index.js'

/**
 * Express pur, sans bootstrap réseau — testable directement via supertest
 * (cf. AFG-DT-000 §3.6 : app.ts / index.ts séparés).
 */
export function createApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(httpLogger(logger))
  app.use(routes)
  app.use(errorHandler(logger))

  return app
}
`,
)

// --- src/index.ts ---
write(
  'src/index.ts',
  `import { createApp } from './app.js'
import { config } from './config/index.js'
import { logger } from './logger.js'

const app = createApp()

app.listen(config.port, () => {
  logger.info(\`${name} listening on port \${config.port}\`)
})
`,
)

// --- tests/health.test.ts ---
write(
  'tests/health.test.ts',
  `import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import { createApp } from '../src/app.js'

describe('GET /health', () => {
  it('répond 200 avec le statut ok', async () => {
    const res = await request(createApp()).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', service: '${name}' })
  })
})
`,
)

// --- Dockerfile ---
write(
  'Dockerfile',
  `FROM node:22-alpine AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile && pnpm --filter ${name} run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/services/${name}/dist ./dist
COPY --from=build /app/services/${name}/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE ${port}
CMD ["node", "dist/index.js"]
`,
)

// --- README.md ---
write(
  'README.md',
  `# ${name}

${description}

Port : \`${port}\`. Voir \`docs/modules/${name}.md\` pour la responsabilité, le périmètre fonctionnel, les
entités, l'API, les événements et les dépendances de ce service.

\`\`\`bash
pnpm --filter ${name} run dev
pnpm --filter ${name} run test
\`\`\`
`,
)

// --- ROADMAP.md ---
write(
  'ROADMAP.md',
  `# Roadmap — ${name}

Voir la section "Roadmap de conception du module" de \`docs/modules/${name}.md\`, et le lot correspondant dans
\`docs/AFG-DT-003_roadmap-conception.md\`.

- [x] Squelette (gabarit Lot 0) : \`app.ts\`/\`index.ts\`, \`/health\`, tests, Dockerfile.
- [ ] Étapes métier : voir la fiche module.
`,
)

console.log(`services/${name} créé (port ${port}).`)
