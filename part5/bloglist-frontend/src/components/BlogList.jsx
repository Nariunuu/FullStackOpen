import { Link as RouterLink } from 'react-router-dom'
import { Container, Paper, Typography, List, ListItem, ListItemButton } from '@mui/material'

const BlogList = ({ blogs }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>blogs</Typography>
      <Paper variant="outlined">
        <List disablePadding>
          {sorted.map((blog) => (
            <ListItem key={blog.id} disablePadding className="blog" divider>
              <ListItemButton component={RouterLink} to={`/blogs/${blog.id}`}>
                {blog.title} {blog.author}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default BlogList
