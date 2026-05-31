import { useParams } from 'react-router-dom'
import BlogDetail from './BlogDetail'
import { useBlogs } from '../hooks/useBlogs'

const BlogDetailRoute = () => {
  const { id } = useParams()
  const { data: blogs = [], isLoading } = useBlogs()

  if (isLoading) return <p>loading...</p>
  const blog = blogs.find((b) => b.id === id)
  if (!blog) return <p>blog not found</p>

  return <BlogDetail blog={blog} />
}

export default BlogDetailRoute
