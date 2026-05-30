import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const ok = await onLogin({ username, password })
    if (ok) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 320, mx: 'auto', mt: 4 }}
    >
      <Typography variant="h5" component="h2">log in to application</Typography>
      <TextField
        label="username"
        placeholder="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        size="small"
      />
      <TextField
        label="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        size="small"
      />
      <Button type="submit" variant="contained">login</Button>
    </Box>
  )
}

export default LoginForm
