const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    let body = request.body

    const users = await User.find({})

    if (!body.likes) {
        body = {
            ...body,
            likes: 0
        }
    }

    let blog = new Blog({
        title: "The blog 7",
        author: "Kalle Mäkilä",
        user: users[0],
        url: "https://blog.theblog7.com",
        likes: 20000
    })

    const savedBlog = await blog.save()
    users[0].blogs = users[0].blogs.concat(savedBlog._id)
    await users[0].save()
    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    let body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter