import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'

const Navigation = ({ user, onLogout }) => (
  <AppBar position="static" sx={{ mb: 2 }}>
    <Toolbar sx={{ gap: 1 }}>
      <Button color="inherit" component={RouterLink} to="/">home</Button>
      {user && (
        <Button color="inherit" component={RouterLink} to="/create">create blog</Button>
      )}
      {!user && (
        <Button color="inherit" component={RouterLink} to="/login">login</Button>
      )}
      <Box sx={{ flexGrow: 1 }} />
      {user && (
        <>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user.name || user.username} logged in
          </Typography>
          <Button color="inherit" variant="outlined" onClick={onLogout}>logout</Button>
        </>
      )}
    </Toolbar>
  </AppBar>
)

export default Navigation
