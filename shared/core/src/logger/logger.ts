import winston from 'winston'

const { combine, timestamp, errors, json, colorize, printf } = winston.format

/**
 * Ré-export du type Logger : les services consomment `Logger` depuis
 * `@shared/core/logger` plutôt que d'ajouter `winston` en dépendance directe
 * juste pour le typage (pnpm strict : pas de deps transitives implicites).
 */
export type Logger = winston.Logger

export interface LoggerOptions {
  serviceName: string
  level?: string
}

const devFormat = printf(({ level, message, timestamp: ts, serviceName, requestId, ...meta }) => {
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
  const corr = requestId ? ` [${requestId}]` : ''
  return `${ts} ${level} [${serviceName}]${corr} ${message}${rest}`
})

/**
 * Fabrique de logger Winston partagé par tous les services.
 * Chaque service crée le sien avec son propre `serviceName` pour la corrélation.
 */
export function createLogger({ serviceName, level }: LoggerOptions): winston.Logger {
  const isProd = process.env.NODE_ENV === 'production'

  return winston.createLogger({
    level: level ?? (isProd ? 'info' : 'debug'),
    defaultMeta: { serviceName },
    format: combine(timestamp(), errors({ stack: true }), isProd ? json() : combine(colorize(), devFormat)),
    transports: [new winston.transports.Console()],
  })
}
