const request = require('supertest');
const app = require('../services/Routes/admin-API'); 

describe('Employee API', () => {
  it('GET /employees - should return list of employees', async () => {
    const res = await request(app).get('/employees');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});
