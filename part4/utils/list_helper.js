const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))
}

const countBy = (items, keyFn) =>
  items.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

const sumBy = (items, keyFn, valueFn) =>
  items.reduce((acc, item) => {
    const key = keyFn(item)
    acc[key] = (acc[key] || 0) + valueFn(item)
    return acc
  }, {})

const topEntry = (totals, label) => {
  const [author, value] = Object.entries(totals)
    .reduce((best, current) => (current[1] > best[1] ? current : best))
  return { author, [label]: value }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  return topEntry(countBy(blogs, (b) => b.author), 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  return topEntry(sumBy(blogs, (b) => b.author, (b) => b.likes), 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
