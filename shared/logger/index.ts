// ================================================================
//  BILIA-V4 — shared/logger/index.ts
//  Logger centralisé (Winston) utilisé par tous les microservices.
//
//  Objectifs :
//   - Format JSON structuré identique partout (service, level, ts, requestId…)
//   - Sortie console lisible en dev, JSON pur en fichier
//   - Centralisation optionnelle : si LOG_COLLECTOR_URL est défini,
//     chaque log est également envoyé en HTTP (compatible Loki,
//     Elastic/Logstash, Grafana Agent, ou un simple collecteur maison).
// ================================================================
import winston from 'winston';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

export interface CreateLoggerOptions {
  /** Nom du service, ex: "auth-service" — apparaît dans chaque log. */
  service: string;
  /** Niveau minimal (par défaut process.env.LOG_LEVEL ou "info"). */
  level?: string;
  /** Dossier de sortie des fichiers de logs (par défaut "logs"). */
  logDir?: string;
}

const consoleFormat = printf(({ level, message, timestamp, service, requestId, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
  const reqStr  = requestId ? ` [${requestId}]` : '';
  return `${timestamp} ${level} [${service}]${reqStr} ${message}${metaStr}`;
});

/**
 * Crée un logger Winston pré-configuré pour un service donné.
 * Chaque service l'instancie une seule fois (ex: dans src/logger.ts) :
 *
 *   export const logger = createLogger({ service: 'auth-service' });
 */
export function createLogger({ service, level, logDir = 'logs' }: CreateLoggerOptions): winston.Logger {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat),
    }),
    new winston.transports.File({
      filename: `${logDir}/${service}-error.log`,
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: `${logDir}/${service}-combined.log`,
      format: combine(timestamp(), json()),
    }),
  ];

  // ── Centralisation optionnelle ──────────────────────────────────
  // Pointer LOG_COLLECTOR_URL vers un endpoint Loki/Elastic/collecteur
  // maison pour agréger les logs de tous les microservices au même
  // endroit (utile en prod / multi-conteneurs).
  if (process.env.LOG_COLLECTOR_URL) {
    try {
      const url = new URL(process.env.LOG_COLLECTOR_URL);
      transports.push(new winston.transports.Http({
        host: url.hostname,
        port: url.port ? Number(url.port) : (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname || '/',
        ssl:  url.protocol === 'https:',
        format: combine(timestamp(), json()),
      }));
    } catch {
      // eslint-disable-next-line no-console
      console.warn(`[${service}] LOG_COLLECTOR_URL invalide, transport HTTP ignoré`);
    }
  }

  return winston.createLogger({
    level: level || process.env.LOG_LEVEL || 'info',
    defaultMeta: { service },
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    exitOnError: false,
  });
}

/**
 * Middleware Express : attribue un requestId (repris du header
 * x-request-id s'il existe, sinon généré) et logue chaque requête HTTP
 * terminée avec sa durée et son code de statut. Brancher juste après
 * helmet()/cors() dans chaque service.
 */
export function httpLogger(logger: winston.Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      logger.log(level, 'http_request', {
        requestId,
        method:   req.method,
        path:     req.originalUrl,
        status:   res.statusCode,
        durationMs: Math.round(durationMs),
        userId:   req.user?.userId,
      });
    });
    next();
  };
}

export type { Logger } from 'winston';
