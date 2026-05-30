import { Card, CardContent, CardActions, Typography, Button, Link, Stack } from '@mui/material'

const BlogDetail = ({ blog, currentUser, onLike, onDelete }) => {
  const ownedByCurrentUser =
    blog.user && currentUser && blog.user.username === currentUser.username

  return (
    <Card className="blog" sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {blog.title} {blog.author}
        </Typography>
        <Link href={blog.url} target="_blank" rel="noopener" sx={{ display: 'block', mb: 1 }}>
          {blog.url}
        </Link>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography>likes {blog.likes}</Typography>
          {currentUser && (
            <Button size="small" variant="outlined" onClick={() => onLike(blog)}>
              like
            </Button>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          added by {blog.user?.name || blog.user?.username}
        </Typography>
      </CardContent>
      {ownedByCurrentUser && (
        <CardActions>
          <Button size="small" color="error" onClick={() => onDelete(blog)}>
            remove
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default BlogDetail
