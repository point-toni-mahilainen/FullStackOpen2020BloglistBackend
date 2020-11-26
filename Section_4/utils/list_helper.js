const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

    return likes
}

const favoriteBlog = (blogs) => {
    const favoriteBlog = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    const blogCounts = blogs.reduce((acc, value) => (
        {
            ...acc,
            [value.author]: (acc[value.author] || 0) + 1
        }
    ), {})

    const mostBlogs = Object.entries(blogCounts).reduce((prev, current) =>
        blogCounts[prev] > blogCounts[current] ?
            { author: prev[0], blogs: prev[1] } : { author: current[0], blogs: current[1] })

    return mostBlogs
}

const mostLikes = (blogs) => {
    const authors = blogs.map(blog => [blog.author, blog.likes]);

    let authorArray = _.uniqBy(blogs, "author").map(blog => ({
        author: blog.author,
        likes: 0
    }));

    _.forEach(authors, ([author, likes]) => {
        const item = _.find(authorArray, ["author", author]);
        item.likes += likes;
    });

    const mostLikes = _.maxBy(authorArray, "likes")
    
    return mostLikes
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}