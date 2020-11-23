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

const blogs = [
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

const mostLikes = (blogs) => {
    // const array2 = blogs.map(blog => {
    //     return { author: blog.author, likes: blog.likes }
    // })
    // console.log(array2);
    const mostLikes = Object.entries(blogs).reduce((prev, current) => {
        // console.log('prev', prev.author);
        // console.log('current[1].author', current[1].author);
        return prev.author === current[1].author ?
            ({ ...prev, author: prev.author, likes: prev.likes + current[1].likes }) : ({ ...prev, author: current[1].author, likes: current[1].likes })
    }, { author: '', likes: 0 })
    // console.log(mostLikes);

    // const mostBlogs = Object.entries(blogCounts).reduce((prev, current) =>
    //     blogCounts[prev] > blogCounts[current] ?
    //         { author: prev[0], blogs: prev[1] } : { author: current[0], blogs: current[1] })

    // console.log(mostBlogs)
}

mostLikes(blogs)

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}