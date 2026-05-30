import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const created = await onCreate({ title, author, url })
    if (created) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}
    >
      <TextField
        label="title"
        placeholder="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        size="small"
      />
      <TextField
        label="author"
        placeholder="author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        size="small"
      />
      <TextField
        label="url"
        placeholder="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        size="small"
      />
      <Button type="submit" variant="contained">create</Button>
    </Box>
  )
}

export default BlogForm
