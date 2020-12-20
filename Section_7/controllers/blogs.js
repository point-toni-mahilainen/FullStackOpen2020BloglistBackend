const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    let body = request.body

    const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : ''
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.likes) {
        body = {
            ...body,
            likes: 0
        }
    }

    let blog = new Blog({
        title: body.title,
        author: body.author,
        user: user._id,
        url: body.url,
        likes: body.likes
    })

    let savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    let body = request.body
    const blog = await Blog.findById(request.params.id)

    let comment = new Comment({
        comment: body.comment,
        blog: blog._id
    })

    let savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)

    await blog.save()
    response.status(201).json(savedComment)
})

blogsRouter.put('/:id', async (request, response) => {
    let body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
        .populate('user', { username: 1, name: 1 })
        .populate('comments', { comment: 1 })
    response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : ''
    const blog = await Blog.findById(request.params.id)
    if (!(decodedToken.id === blog.user.toString())) {
        return response.status(401).json({ error: 'token missing or not have permissions to this operation' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter