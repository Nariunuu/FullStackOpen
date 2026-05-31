import { createContext, useContext, useEffect, useState } from 'react'
import persistentUser from '../services/persistentUser'
import blogService from '../services/blogs'

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = persistentUser.getUser()
    if (stored) {
      setUser(stored)
      blogService.setToken(stored.token)
    }
  }, [])

  const login = (loggedUser) => {
    persistentUser.saveUser(loggedUser)
    blogService.setToken(loggedUser.token)
    setUser(loggedUser)
  }

  const logout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
