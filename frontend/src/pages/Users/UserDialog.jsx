import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from 'react-toastify';

const UserDialog = ({ visible, user, onClose, onSave }) => {
  const [email] = useState(user.email)
  const [role, setRole] = useState(user.role)
  const [fullName, setFullName] = useState(user.full_name)
  const [phone, setPhone] = useState(user.phone)
  const [isEditable, setIsEditable] = useState(false)

  const handleSave = () => {
    const updatedUser = {
      email,
      full_name: fullName,
      phone,
    }
    onSave(updatedUser)
    setIsEditable(false)
  }
  const toggleEdit = () => {
    setIsEditable((prev) => !prev)
  }

  return (
    <>
      <Dialog open={visible} onClose={onClose} maxWidth="xs" fullWidth>
        <Box style={{
          backgroundColor: "rgba(0, 60, 100, 0.96)",
        }}>
          <DialogTitle style={{
            border: "none",
            fontSize: "1.2rem", color: 'white', fontWeight: 'bold', justifyContent: "space-between"
          }}>
            User Details
            <Tooltip title={isEditable ? "Disable Editing" : "Enable Editing"}>
              <IconButton
                onClick={toggleEdit}
                sx={{ color: "white" }}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
        </Box>
        {/* BODY */}
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} marginBottom={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                label="Email"
                value={email}
                fullWidth
                size="small"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                label="Role"
                value={role}
                fullWidth
                size="small"
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                size="small"
                disabled={!isEditable}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                disabled={!isEditable}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* FOOTER */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: "#adabadff",
              fontWeight: "bold",
              color: "black",
              "&:hover": {
                backgroundColor: "#9f9f9f",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!isEditable}
            sx={{
              backgroundColor: "rgba(0, 60, 100, 0.96)",
              fontWeight: "bold",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 60, 100, 0.7)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserDialog;