const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helpers')

describe('get blogs when database has some initial data', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(6)
    })

    describe('add a new blog', () => {
        test('a blog can be added with valid content', async () => {
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

            const blogs = await helper.blogsInDb()
            expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

            const titles = blogs.map(blog => blog.title)
            expect(titles).toContain(
                'Async/Await explained'
            )
        });

        describe('update the existing blog', () => {
            test('the blog can be updated with valid content', async () => {
                const blogsInDb = await helper.blogsInDb()

                const blogToUpdate = blogsInDb[0]

                const blogWithUpdates = {
                    ...blogToUpdate,
                    likes: 200
                }

                await api.put(`/api/blogs/${blogToUpdate.id}`)
                    .send(blogWithUpdates)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)

                const blogs = await helper.blogsInDb()
                expect(blogs).toHaveLength(helper.initialBlogs.length)

                const updatedBlog = blogs.find(blog => blog.id === blogWithUpdates.id)
                expect(updatedBlog).toEqual(blogWithUpdates)
            });

            describe('delete the blog', () => {
                test('deletion with valid id, succeeds with status code 204', async () => {
                    const blogsInDb = await helper.blogsInDb()

                    const blogToDelete = blogsInDb[0]

                    await api.delete(`/api/blogs/${blogToDelete.id}`)
                        .expect(204)

                    const blogs = await helper.blogsInDb()
                    expect(blogs).toHaveLength(helper.initialBlogs.length - 1)

                    const titles = blogs.map(blog => blog.title)
                    expect(titles).not.toContain(blogToDelete.title)
                });

                describe('field/content correction checks', () => {
                    test('correct id field', async () => {
                        const response = await api.get('/api/blogs')

                        response.body.map(blog => expect(blog.id).toBeDefined())
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

                        const blogs = await helper.blogsInDb()
                        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
                    });

                    test('if the all content is not defined', async () => {
                        let newBlog = {
                            author: "George Hamilton",
                            likes: 20
                        }

                        await api.post('/api/blogs')
                            .send(newBlog)
                            .expect(400)

                        const blogs = await helper.blogsInDb()
                        expect(blogs).toHaveLength(helper.initialBlogs.length)
                    });

                });
            });
        });
    });
});

afterAll(() => {
    mongoose.connection.close()
})
