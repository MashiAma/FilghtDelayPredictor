import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Switch,
  Button,
  Typography,
  Pagination,
  Stack,
  useTheme,
} from "@mui/material";
import { toast } from 'react-toastify';
import { Lock, LockOpen } from "@mui/icons-material";
import UserDialog from './UserDialog';
import { getAllUsers, getUser, updateUser, updateUserStatus } from '../../services/authService'

const ViewUser = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const theme = useTheme();

  const rowsPerPage = 5

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        setUsers(response.data)
      } catch (error) {
        toast.error('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  const handleView = (user) => {
    setSelectedUser(user)
    setVisibleDialog(true)
  }

  const handleSave = async (updatedUser) => {
    try {
      // Pass email and data separately
      const response = await updateUser(updatedUser.email, updatedUser)

      // Use the response from backend to update local state
      const updatedList = users.map((user) =>
        user.email === updatedUser.email ? response.data : user
      )

      setUsers(updatedList)
      setVisibleDialog(false)
      toast.success('User updated successfully')
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
    }
  }


  const handleToggleStatus = async (user) => {
    const updatedStatus = !user.is_active

    try {
      await updateUserStatus(user.email, updatedStatus)

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === user.email
            ? { ...u, is_active: updatedStatus }
            : u
        )
      )

      toast.success(
        `User ${updatedStatus ? 'Enabled' : 'Disabled'} successfully`
      )
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user status')
    }
  }


  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();

    // Safely check if properties exist
    const name = user.full_name ? user.full_name.toLowerCase() : '';
    const email = user.email ? user.email.toLowerCase() : '';

    return name.includes(query) || email.includes(query);
  });


  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  return (
    <>
      <Box p={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={0}
        >
          <Typography variant="h5" style={{
            border: "none",
            fontSize: "1.2rem",
            fontWeight: 'bold',
            color: theme.palette.text.main,
          }}>
            User List
          </Typography>

          {/* RIGHT: SEARCH */}
          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: 400,
              "& input": {
                fontSize: "0.75rem",
                color: theme.palette.text.primary,
                height: "15px"
              },
              "& input::placeholder": {
                color: "#a3a3a3ff",
                opacity: 1,
              },
              "& fieldset": {
                border: "1px solid #0e4a99",
              },
              backgroundColor: theme.palette.background.default,
            }}
          />
        </Box>
        <Card
          sx={{
            // p: { xs: 2, md: 2 },
            marginTop: "25px",
            border: "none",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Card
            sx={{
              minHeight: 350,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent>
              {/* TABLE */}
              <TableContainer component={Paper} sx={{ backgroundColor: "transparent" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Full Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Phone Number</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Toggle</TableCell>
                      <TableCell sx={{ fontWeight: "bold", py: 0.5 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ color: theme.palette.text.primary, py: 0.1 }}>
                            {user.full_name}
                          </TableCell>

                          <TableCell sx={{ color: theme.palette.text.primary, py: 0.1 }}>
                            {user.email}
                          </TableCell>

                          <TableCell sx={{ color: theme.palette.text.primary, py: 0.1 }}>
                            {user.role}
                          </TableCell>

                          <TableCell sx={{ color: theme.palette.text.primary, py: 0.1 }}>
                            {user.phone}
                          </TableCell>

                          <TableCell sx={{ color: theme.palette.text.primary, py: 0.1 }}>
                            {user.is_active ? "Enabled" : "Disabled"}
                          </TableCell>

                          <TableCell>
                            <Switch
                              checked={user.is_active}
                              onChange={() => handleToggleStatus(user)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "rgba(0, 60, 100, 0.96)",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                  backgroundColor: "rgba(0, 60, 100, 0.96)",
                                },
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleView(user)}
                              sx={{
                                backgroundColor: "rgba(0, 60, 100, 0.96)",
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 60, 100, 0.7)",
                                },
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No matching users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* PAGINATION */}
              <Stack mt={3} alignItems="center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Stack>
            </CardContent>

            {/* DIALOG */}
            {visibleDialog && selectedUser && (
              <UserDialog
                visible={visibleDialog}
                user={selectedUser}
                onClose={() => setVisibleDialog(false)}
                onSave={handleSave}
              />
            )}
          </Card>
        </Card >
      </Box >

    </>
  )
}

export default ViewUser
