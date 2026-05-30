const Notifications = ({ message, status }) => {
  return (
    <div className={`notification-${status?.toLowerCase() || 'notification'}`}>
      {message}
    </div>
  )
}

export default Notifications