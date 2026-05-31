import { Alert } from '@mui/material'
import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()
  if (!notification) return null
  const severity = notification.type === 'error' ? 'error' : 'success'
  return (
    <Alert severity={severity} sx={{ maxWidth: 600, mx: 'auto', my: 1 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
