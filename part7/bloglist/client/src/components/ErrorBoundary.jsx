import { Component } from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            {this.state.error.message}
          </Alert>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
