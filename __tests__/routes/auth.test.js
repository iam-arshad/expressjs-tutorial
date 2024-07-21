const request = require('supertest');
const app = require("../../src/index.js")
const mongoose = require("mongoose")

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'OiJIUzI1NiIpXVCJ9.eyJpZCI6I'),
    verify: jest.fn((token, secret, cb) => cb(null, {})),
}))

jest.mock('../../src/database/schemas/users', () => {
    const testUser = {
        id: 'gfh@442yg',
        username: 'abc@abc.com',
        password: '$2b$10$qhg0zCs3MBtrVgQWYkPuBCiY7SfERjA.4rx37ASn7jTQH1tih2S',
    }
    return {
        ...jest.requireActual('../../src/database/schemas/users'),
        findOne: jest.fn(() => testUser),
        findOneAndUpdate: jest.fn(),
        findById: jest.fn(() => testUser),
    }
})

jest.mock('bcrypt', () => ({
    compare: jest.fn().mockResolvedValue(true),
}))


test("should not access the /GET profile route before logging in", async () => {
    const response = await request(app).get('/auth/profile');
    expect(response.statusCode).toBe(401);
    expect(response.text).toBe("You're not logged in");
})

describe('Able to access all protected routes, after logging in', () => {
    // should login and retrieve the sessionId from cookies
    let sessionId, responseBody;
    beforeAll(async () => {
        const response = await request(app).post('/auth/login').send({ username: "abc@abc.com", password: "abc@abc.com" });
        sessionId = response.headers['set-cookie'];
        responseBody = response.body;
    })

    test("should access the /GET profile route", async () => {
        const response = await request(app).get('/auth/profile').set('cookie', sessionId).set('authorization', responseBody.accessToken);
        expect(response.text).toBe('Welcome to your profile, abc@abc.com');
        expect(response.statusCode).toBe(200);
    })

    test("should login and should pass the /GET todos api", async () => {
        const response = await request(app).get('/todos').set('cookie', sessionId);
        expect(response.body).toHaveLength(2);
    })
})


afterAll(async () => {
    await mongoose.connection.close();
})