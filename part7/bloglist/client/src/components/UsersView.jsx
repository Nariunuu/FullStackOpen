import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Link,
} from '@mui/material'
import { useUsers } from '../hooks/useUsers'

const UsersView = () => {
  const { data: users = [], isLoading, isError } = useUsers()

  if (isLoading) return <p>loading users...</p>
  if (isError) return <p>failed to load users</p>

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Users
      </Typography>
      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/users/${u.id}`}>
                    {u.name || u.username}
                  </Link>
                </TableCell>
                <TableCell align="right">{u.blogs?.length ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default UsersView
