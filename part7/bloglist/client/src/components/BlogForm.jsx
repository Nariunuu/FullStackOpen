import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useCreateBlog } from '../hooks/useBlogs'
import { useNotification } from '../contexts/NotificationContext'
import { useField } from '../hooks/useField'

const BlogForm = () => {
  const title = useField()
  const author = useField()
  const url = useField()
  const createBlog = useCreateBlog()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const created = await createBlog.mutateAsync({
        title: title.value,
        author: author.value,
        url: url.value,
      })
      notify(
        `a new blog ${created.title} by ${created.author ?? 'unknown'} added`
      )
      title.reset()
      author.reset()
      url.reset()
      navigate('/')
    } catch {
      notify('failed to create blog', 'error')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 420,
        mx: 'auto',
        mt: 2,
      }}
    >
      <Typography variant="h5" component="h2">
        create new blog
      </Typography>
      <TextField label="title" size="small" {...title.inputProps} />
      <TextField label="author" size="small" {...author.inputProps} />
      <TextField label="url" size="small" {...url.inputProps} />
      <Button type="submit" variant="contained">
        create
      </Button>
    </Box>
  )
}

export default BlogForm
