import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography, Link } from '@mui/material'

const NotFound = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h5" gutterBottom>
      Page not found
    </Typography>
    <Link component={RouterLink} to="/">
      Back to home
    </Link>
  </Box>
)

export default NotFound
