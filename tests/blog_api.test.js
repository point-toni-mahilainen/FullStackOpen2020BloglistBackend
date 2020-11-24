const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('blog API', () => {
    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(6)
    })

    test('correct id field', async () => {
        const response = await api.get('/api/blogs')

        response.body.map(blog => expect(blog.id).toBeDefined())
    });

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Async/Await explained",
            author: "George Hamilton",
            url: "https://blog.asyncronius.com/",
            likes: 70
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await Blog.find({})
        expect(blogs).toHaveLength(initialBlogs.length + 1)

        const titles = notesAtEnd.map(blog => blog.title)
        expect(titles).toContain(
            'Async/Await explained'
        )
    });

    test('if likes-field is not exists, the value is set to 0', async () => {
        let newBlog = {
            title: "Async/Await explained",
            author: "George Hamilton",
            url: "https://blog.asyncronius.com/"
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const blogs = await Blog.find({})
        expect(blogs).toHaveLength(initialBlogs.length + 1)
    });

    test('if the all content is not defined', async () => {
        let newBlog = {
            author: "George Hamilton",
            likes: 20
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await Blog.find({})
        expect(blogs).toHaveLength(initialBlogs.length)
    });

    afterAll(() => {
        mongoose.connection.close()
    })
});
