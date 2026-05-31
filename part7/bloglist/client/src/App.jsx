import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogDetailRoute from './components/BlogDetailRoute'
import UsersView from './components/UsersView'
import UserDetail from './components/UserDetail'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useUser } from './contexts/UserContext'

const RequireAuth = ({ children }) => {
  const { user } = useUser()
  return user ? children : <Navigate to="/login" />
}

const App = () => {
  const { user } = useUser()

  return (
    <div>
      <Navigation />
      <ErrorBoundary>
        <Notification />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <BlogList />
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginForm />}
          />
          <Route
            path="/create"
            element={
              <RequireAuth>
                <BlogForm />
              </RequireAuth>
            }
          />
          <Route path="/blogs/:id" element={<BlogDetailRoute />} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
