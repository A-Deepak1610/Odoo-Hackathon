const request = require('supertest');
const app = require('../src/app');

describe('Health Module', () => {
  it('should return 200 OK from the /api/v1/health endpoint', async () => {
    const response = await request(app).get('/api/v1/health');
    
    expect(response.status).toBe(200);
    // The exact body depends on the health controller, but usually it returns a success flag or message
    expect(response.body).toHaveProperty('success', true);
  });
});
