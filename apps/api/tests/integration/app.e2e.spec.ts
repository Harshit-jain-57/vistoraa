import request from 'supertest';

import { createApp } from '../../src/app';

describe('Vistora API root', () => {
  it('returns service metadata', async () => {
    const app = createApp();

    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.service).toBe('vistora-api');
  });
});
