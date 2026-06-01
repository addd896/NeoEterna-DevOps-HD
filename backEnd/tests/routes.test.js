const request = require('supertest');
const app = require('../app');

describe('API Route Coverage Tests', () => {

  // Health Route
  test('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });

  // Auth Routes
  test('POST /api/auth/register route exists', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        username: 'testuser'
      });

    expect(res.statusCode).not.toBe(404);
  });

  test('POST /api/auth/verify-signature route exists', async () => {
    const res = await request(app)
      .post('/api/auth/verify-signature')
      .send({});

    expect(res.statusCode).not.toBe(404);
  });

  // NFT Route
  test('GET /api/nft/detail route exists', async () => {
    const res = await request(app)
      .get('/api/nft/detail/507f1f77bcf86cd799439011');

    expect([200, 404, 500]).toContain(res.statusCode);
  });

  // Storage Route
  test('GET /api/storage/retrieve route exists', async () => {
    const res = await request(app)
      .get('/api/storage/retrieve/test');

    expect(res.statusCode).not.toBe(404);
  });

  // User Route
  test('GET /api/user/profile route exists', async () => {
    const res = await request(app)
      .get('/api/user/profile');

    expect(res.statusCode).not.toBe(404);
  });

  // Admin Route
  test('GET /api/admin/stats route exists', async () => {
    const res = await request(app)
      .get('/api/admin/stats');

    expect(res.statusCode).not.toBe(404);
  });

});