const request = require('supertest');
const app = require('../src/app');

describe('Global App Configuration', () => {
  it('should return a 404 error for unknown routes', async () => {
    const response = await request(app).get('/api/v1/some-unknown-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
  });
});
