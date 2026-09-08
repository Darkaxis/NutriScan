import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';

describe('Authentication System (Email, Username, Password)', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
  });

  it('should register a new user with username, email, and password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testchef',
        email: 'testchef@example.com',
        password: 'securepassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('testchef@example.com');
    expect(res.body.user.username).toBe('testchef');
  });

  it('should reject registration if email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'validuser',
        email: 'invalid-email',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Valid email address is required');
  });

  it('should reject registration if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'validuser',
        email: 'valid@example.com',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Password must be at least 6 characters');
  });

  it('should log in using username and password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'testchef',
        password: 'securepassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('testchef');
  });

  it('should log in using email and password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'testchef@example.com',
        password: 'securepassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('testchef@example.com');
  });

  it('should reject login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'testchef',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid password');
  });

  it('should verify that external third-party oauth endpoints do not exist', async () => {
    const res = await request(app)
      .post('/api/auth/external-oauth')
      .send({
        email: 'anyone@example.com',
      });

    // Endpoint does not exist, router returns 404
    expect(res.status).toBe(404);
  });
});
