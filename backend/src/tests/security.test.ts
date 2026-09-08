import request from 'supertest';
import express from 'express';
import { app } from '../app';
import { createRateLimiter } from '../middlewares/rateLimiter.middleware';

describe('Security & Penetration Testing Hardening Tests', () => {
  it('should reject login for non-existent users instead of auto-provisioning', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'ghost_user_does_not_exist@example.com',
        password: 'somepassword123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toContain('Invalid password or credentials');
  });

  it('should reject registration inputs that exceed maximum length bounds', async () => {
    const longPassword = 'a'.repeat(200);
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'validuser',
        email: 'validuser@example.com',
        password: longPassword,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Password must be at least 6 characters (max 128)');
  });

  it('should include defense-in-depth HTTP security headers and omit X-Powered-By', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  it('should reject invalid or malicious barcode inputs with HTTP 400', async () => {
    const res = await request(app).get('/api/products/bad;drop%20table');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('InvalidBarcode');
  });

  it('should deny unauthenticated requests to /api/stripe/verify-session with HTTP 401', async () => {
    const res = await request(app)
      .post('/api/stripe/verify-session')
      .send({ sessionId: 'cs_fake_session' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should enforce rate limiting and respond with HTTP 429 when threshold exceeded', async () => {
    const testApp = express();
    const testLimiter = createRateLimiter({
      windowMs: 60 * 1000,
      maxRequests: 3,
      message: 'Rate limit exceeded',
    });

    testApp.use(testLimiter);
    testApp.get('/test', (req, res) => res.json({ ok: true }));

    // Request 1, 2, 3 should succeed
    const r1 = await request(testApp).get('/test').set('x-test-rate-limit', 'true');
    const r2 = await request(testApp).get('/test').set('x-test-rate-limit', 'true');
    const r3 = await request(testApp).get('/test').set('x-test-rate-limit', 'true');

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(r3.status).toBe(200);

    // Request 4 should be blocked with 429
    const r4 = await request(testApp).get('/test').set('x-test-rate-limit', 'true');
    expect(r4.status).toBe(429);
    expect(r4.body.error).toBe('TooManyRequests');
    expect(r4.headers['retry-after']).toBeDefined();
  });
});
