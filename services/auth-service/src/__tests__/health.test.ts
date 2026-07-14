// ================================================================
//  BILIA-V4 — services/auth-service/src/__tests__/health.test.ts
//  Test d'intégration léger : vérifie que l'app Express répond,
//  sans nécessiter de vraie connexion MongoDB.
// ================================================================
import request from 'supertest';
import app from '../app';

describe('GET /health', () => {
  it('répond 200 avec le statut du service', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ service: 'auth-service', status: 'ok' });
  });
});

describe('routes protégées', () => {
  it('renvoie 401 sans token sur une route nécessitant une auth', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
