import 'dotenv/config'
const request = require('supertest');
import app from '../src/app'


describe('app.ts', () => {
    it('should return 200', async () => {
        await request(app).get('/hello-world').expect(200)
    });
});