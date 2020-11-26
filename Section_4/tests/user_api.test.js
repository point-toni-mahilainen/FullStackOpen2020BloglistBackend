const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helpers')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

describe('the user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await helper.initialUsersToDb()
    })

    test('the user can not be created with too short password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "keijoke",
            name: "Keijo Kekäle",
            password: "sa"
        }

        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.error).toContain('password length must be 3 or more characters')
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    });
});

afterAll(() => {
    mongoose.connection.close()
})