const request = require('supertest');
const app = require('../app');

describe('GET /api/parts/:id', () => {
  it('responds with 200', async () => {
    await request(app).get('/api/parts/123').expect(200);
  });
});

describe('Static file serving', () => {
  it('serves index.html with 200', async () => {
    await request(app).get('/index.html').expect(200);
  });
});
