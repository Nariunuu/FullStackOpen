import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Link,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { useLikeBlog, useDeleteBlog } from '../hooks/useBlogs'
import { useUser } from '../contexts/UserContext'
import { useNotification } from '../contexts/NotificationContext'

const BlogDetail = ({ blog }) => {
  const { user } = useUser()
  const likeBlog = useLikeBlog()
  const deleteBlog = useDeleteBlog()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const ownedByCurrentUser =
    blog.user && user && blog.user.username === user.username

  const handleLike = async () => {
    try {
      await likeBlog.mutateAsync(blog)
    } catch {
      notify('failed to update blog', 'error')
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author ?? 'unknown'}?`
    )
    if (!confirmed) return
    try {
      await deleteBlog.mutateAsync(blog.id)
      notify(`removed ${blog.title}`)
      navigate('/')
    } catch {
      notify('failed to delete blog', 'error')
    }
  }

  const comments = blog.comments ?? []

  return (
    <Card className="blog" sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title} {blog.author}
        </Typography>
        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          sx={{ display: 'block', mb: 1 }}
        >
          {blog.url}
        </Link>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography>likes {blog.likes}</Typography>
          {user && (
            <Button size="small" variant="outlined" onClick={handleLike}>
              like
            </Button>
          )}
        </Stack>
        {blog.user && (
          <Typography variant="body2" color="text.secondary">
            added by{' '}
            <Link component={RouterLink} to={`/users/${blog.user.id ?? ''}`}>
              {blog.user.name || blog.user.username}
            </Link>
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" component="h3">
          comments
        </Typography>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            no comments yet
          </Typography>
        ) : (
          <List dense>
            {comments.map((comment, idx) => (
              <ListItem key={idx} disableGutters>
                <ListItemText primary={comment} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
      {ownedByCurrentUser && (
        <CardActions>
          <Button size="small" color="error" onClick={handleDelete}>
            remove
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default BlogDetail
