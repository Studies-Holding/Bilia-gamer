// ================================================================
//  BILIA-V4 — services/core-service/src/__tests__/health.test.ts
//  Test d'intégration léger : vérifie que l'app Express répond,
//  sans nécessiter de vraie connexion MongoDB.
// ================================================================
import request from 'supertest';
import app from '../app';

describe('GET /health', () => {
  it('répond 200 avec le statut du service', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ service: 'core-service', status: 'ok' });
  });
});

describe('GET /api/themes (public)', () => {
  it('répond sans authentification', async () => {
    const res = await request(app).get('/api/themes');
    expect(res.status).not.toBe(401);
  });
});

describe('routes protégées', () => {
  it('renvoie 401 sans token sur /api/shop', async () => {
    const res = await request(app).get('/api/shop');
    expect(res.status).toBe(401);
  });
});

describe('404', () => {
  it("renvoie une erreur JSON pour une route inconnue", async () => {
    const res = await request(app).get('/api/route-inexistante');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
