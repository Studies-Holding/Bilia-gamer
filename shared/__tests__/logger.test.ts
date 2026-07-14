import { createLogger, httpLogger } from '../logger';
import type { Request, Response } from 'express';

describe('shared/logger — createLogger', () => {
  it('crée un logger avec le nom de service en meta par défaut', () => {
    const logger = createLogger({ service: 'test-service', logDir: '/tmp/bilia-test-logs' });
    expect(logger).toBeDefined();
    expect(logger.defaultMeta).toEqual({ service: 'test-service' });
  });

  it("utilise le niveau LOG_LEVEL de l'environnement si fourni", () => {
    const prev = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = 'debug';
    const logger = createLogger({ service: 'test-service', logDir: '/tmp/bilia-test-logs' });
    expect(logger.level).toBe('debug');
    process.env.LOG_LEVEL = prev;
  });

  it("respecte le niveau explicite passé en option, prioritaire sur l'env", () => {
    const logger = createLogger({ service: 'test-service', level: 'warn', logDir: '/tmp/bilia-test-logs' });
    expect(logger.level).toBe('warn');
  });
});

describe('shared/logger — httpLogger middleware', () => {
  function buildReqRes() {
    const listeners: Record<string, () => void> = {};
    const req = {
      headers: {},
      method: 'GET',
      originalUrl: '/api/test',
    } as unknown as Request;
    const res = {
      setHeader: jest.fn(),
      statusCode: 200,
      on: (event: string, cb: () => void) => { listeners[event] = cb; },
    } as unknown as Response;
    return { req, res, trigger: (event: string) => listeners[event]?.() };
  }

  it('génère un requestId et le place sur req + header de réponse', () => {
    const logger = createLogger({ service: 'test-service', logDir: '/tmp/bilia-test-logs' });
    const spy = jest.spyOn(logger, 'log').mockImplementation(() => logger);
    const middleware = httpLogger(logger);
    const { req, res, trigger } = buildReqRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', req.requestId);
    expect(next).toHaveBeenCalled();

    trigger('finish');
    expect(spy).toHaveBeenCalledWith('info', 'http_request', expect.objectContaining({
      requestId: req.requestId,
      method: 'GET',
      path: '/api/test',
      status: 200,
    }));
  });

  it('réutilise le x-request-id entrant au lieu d\'en générer un nouveau', () => {
    const logger = createLogger({ service: 'test-service', logDir: '/tmp/bilia-test-logs' });
    jest.spyOn(logger, 'log').mockImplementation(() => logger);
    const middleware = httpLogger(logger);
    const { req, res } = buildReqRes();
    req.headers['x-request-id'] = 'corr-id-123';

    middleware(req, res, jest.fn());

    expect(req.requestId).toBe('corr-id-123');
  });

  it('logue en "warn" les réponses 4xx et en "error" les réponses 5xx', () => {
    const logger = createLogger({ service: 'test-service', logDir: '/tmp/bilia-test-logs' });
    const spy = jest.spyOn(logger, 'log').mockImplementation(() => logger);
    const middleware = httpLogger(logger);

    const { req, res, trigger } = buildReqRes();
    (res as unknown as { statusCode: number }).statusCode = 404;
    middleware(req, res, jest.fn());
    trigger('finish');
    expect(spy).toHaveBeenCalledWith('warn', 'http_request', expect.any(Object));

    const { req: req2, res: res2, trigger: trigger2 } = buildReqRes();
    (res2 as unknown as { statusCode: number }).statusCode = 500;
    middleware(req2, res2, jest.fn());
    trigger2('finish');
    expect(spy).toHaveBeenCalledWith('error', 'http_request', expect.any(Object));
  });
});
