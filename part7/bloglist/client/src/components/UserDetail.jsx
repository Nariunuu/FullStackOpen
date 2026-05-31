import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material'
import { useUsers } from '../hooks/useUsers'

const UserDetail = () => {
  const { id } = useParams()
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) return <p>loading...</p>
  const user = users.find((u) => u.id === id)
  if (!user) return <p>user not found</p>

  const blogs = user.blogs ?? []

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {user.name || user.username}
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        added blogs
      </Typography>
      <Paper variant="outlined">
        {blogs.length === 0 ? (
          <Typography sx={{ p: 2 }} color="text.secondary">
            no blogs yet
          </Typography>
        ) : (
          <List disablePadding>
            {blogs.map((blog) => (
              <ListItem key={blog.id} divider>
                <ListItemText primary={blog.title} secondary={blog.author} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}

export default UserDetail
