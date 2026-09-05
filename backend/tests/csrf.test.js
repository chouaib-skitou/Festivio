const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const {
  doubleCsrfProtection,
  issueCsrfToken,
  isInvalidCsrfTokenError,
} = require('../middlewares/csrfMiddleware');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/csrf-token', doubleCsrfProtection, issueCsrfToken);
app.post('/protected', doubleCsrfProtection, (_req, res) => {
  res.status(204).send();
});
app.use((error, _req, res, _next) => {
  res.status(isInvalidCsrfTokenError(error) ? 403 : 500).json({
    message: isInvalidCsrfTokenError(error) ? 'Invalid CSRF token' : 'Unexpected error',
  });
});

describe('CSRF protection', () => {
  it('rejects state-changing requests without a CSRF token', async () => {
    const response = await request(app).post('/protected').send({});
    expect(response.status).toBe(403);
  });

  it('accepts the signed double-submit token issued to the client', async () => {
    const agent = request.agent(app);
    const tokenResponse = await agent.get('/csrf-token');
    expect(tokenResponse.status).toBe(200);
    expect(tokenResponse.body.csrfToken).toEqual(expect.any(String));

    const response = await agent
      .post('/protected')
      .set('x-csrf-token', tokenResponse.body.csrfToken)
      .send({});

    expect(response.status).toBe(204);
  });
});
