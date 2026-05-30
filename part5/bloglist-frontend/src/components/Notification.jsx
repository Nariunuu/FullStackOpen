import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (!message) return null
  const severity = type === 'error' ? 'error' : 'success'
  return (
    <Alert severity={severity} sx={{ maxWidth: 600, mx: 'auto', my: 1 }}>
      {message}
    </Alert>
  )
}

export default Notification
