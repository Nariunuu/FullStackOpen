import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogDetailRoute from './components/BlogDetailRoute'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'bloglistUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      blogService.setToken(parsed.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(setBlogs)
    }
  }, [user])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      navigate('/')
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
    navigate('/login')
  }

  const handleCreate = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      const enriched = {
        ...created,
        user: { username: user.username, name: user.name },
      }
      setBlogs(blogs.concat(enriched))
      notify(`a new blog ${created.title} by ${created.author ?? 'unknown'} added`)
      navigate('/')
      return true
    } catch {
      notify('failed to create blog', 'error')
      return false
    }
  }

  const handleLike = async (blog) => {
    try {
      const updated = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id,
      })
      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...updated, user: blog.user } : b
        )
      )
    } catch {
      notify('failed to update blog', 'error')
    }
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author ?? 'unknown'}?`
    )
    if (!confirmed) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notify(`removed ${blog.title}`)
      navigate('/')
    } catch {
      notify('failed to delete blog', 'error')
    }
  }

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <Notification message={notification?.message} type={notification?.type} />
      <Routes>
        <Route
          path="/"
          element={user ? <BlogList blogs={blogs} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/create"
          element={
            user ? (
              <div>
                <h2>create new blog</h2>
                <BlogForm onCreate={handleCreate} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetailRoute
              blogs={blogs}
              currentUser={user}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
