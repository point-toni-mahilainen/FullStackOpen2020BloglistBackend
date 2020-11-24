const blogsRouter = require('express').Router()
const { update } = require('../models/blog')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', (request, response, next) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    let body = request.body

    if (!body.likes) {
        body = {
            ...body,
            likes: 0
        }
    }

    let blog = new Blog(body)

    blog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    let body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog.toJSON())
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter