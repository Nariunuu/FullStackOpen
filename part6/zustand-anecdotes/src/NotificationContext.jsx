/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (_state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return _state
  }
}

const NotificationContext = createContext(null)

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')
  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotify = () => {
  const [, dispatch] = useContext(NotificationContext)
  return (message) => {
    dispatch({ type: 'SET', payload: message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }
}
