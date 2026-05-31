import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import loginService from '../services/login'
import { useUser } from '../contexts/UserContext'
import { useNotification } from '../contexts/NotificationContext'
import { useField } from '../hooks/useField'

const LoginForm = () => {
  const username = useField()
  const password = useField('password')
  const { login } = useUser()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({
        username: username.value,
        password: password.value,
      })
      login(loggedUser)
      username.reset()
      password.reset()
      navigate('/')
    } catch {
      notify('wrong username or password', 'error')
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
        maxWidth: 320,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" component="h2">
        log in to application
      </Typography>
      <TextField label="username" size="small" {...username.inputProps} />
      <TextField label="password" size="small" {...password.inputProps} />
      <Button type="submit" variant="contained">
        login
      </Button>
    </Box>
  )
}

export default LoginForm
