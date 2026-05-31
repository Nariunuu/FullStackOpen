import { createContext, useContext, useReducer, useRef } from 'react'

const NotificationContext = createContext(null)

const initialState = null

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, initialState)
  const timerRef = useRef(null)

  const notify = (message, type = 'success', durationMs = 4000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    dispatch({ type: 'SET', payload: { message, type } })
    timerRef.current = setTimeout(() => dispatch({ type: 'CLEAR' }), durationMs)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
