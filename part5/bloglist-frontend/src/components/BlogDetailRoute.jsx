import { useParams } from 'react-router-dom'
import BlogDetail from './BlogDetail'

const BlogDetailRoute = ({ blogs, currentUser, onLike, onDelete }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <p>blog not found</p>
  }

  return (
    <BlogDetail
      blog={blog}
      currentUser={currentUser}
      onLike={onLike}
      onDelete={onDelete}
    />
  )
}

export default BlogDetailRoute
