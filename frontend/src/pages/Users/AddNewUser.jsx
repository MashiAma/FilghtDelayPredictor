import React, { useState } from 'react'
import {
  Card,
  Typography,
  Grid,
  TextField,
  Select,
  Box,
  MenuItem,
  FormControl,
  IconButton,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import { toast } from 'react-toastify';
import { register } from '../../services/authService';
import { useTheme } from "@mui/material";


const AddNewUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('normal')
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)


  const handleCreateUser = async () => {
    // Required field checks
    if (!email || !password || !fullName) {
      toast.error('Email Address, Password, and Full Name are required.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password validation
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    // Payload MUST match FastAPI schema
    const newUser = {
      full_name: fullName,          // snake_case
      email: email,
      password: password,
      phone: phone || null,         // optional
      role: role.toLowerCase(),
    };
    setLoading(true)
    try {
      const response = await register(newUser);

      toast.success('User added successfully!');
      //console.log('Created user:', response.data);

      // Clear form
      setFullName('');
      setRole('');
      setEmail('');
      setPassword('');
      setPhone('');

    } catch (error) {
      console.error('Error adding user:', error);

      if (error.response?.status === 409) {
        toast.error('User already exists.');
      } else {
        toast.error('Failed to add user. Please try again.');
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" style={{
          border: "none",
          fontSize: "1.2rem",
          fontWeight: 'bold',
          color: theme.palette.text.main,
          marginBottom: "20px"
        }}>
          Create New User
        </Typography>

        <Card sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography fontWeight="bold" color={theme.palette.text.main}>
                Full Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name..."
                sx={{
                  mt: 1,
                  borderRadius: "15px",
                  "& input": {
                    fontSize: "0.75rem",
                    color: theme.palette.text.primary,
                  },
                  "& fieldset": {
                    border: "1px solid #0e4a99",
                  },
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography fontWeight="bold" color={theme.palette.text.main}>
                Role
              </Typography>
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  sx={{
                    fontSize: "0.75rem",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    "& fieldset": {
                      border: "1px solid #0e4a99",
                    },
                    height: 35,
                    '& .MuiOutlinedInput-root': {
                      py: 0,
                      height: 35,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: "11px"
                    },
                  }}
                >
                  <MenuItem value="admin" sx={{ minHeight: 30, py: 0.5 }}>Admin</MenuItem>
                  <MenuItem value="normal" sx={{ minHeight: 30, py: 0.5 }}>Normal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} marginTop={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography fontWeight="bold" color={theme.palette.text.main}>
                Email
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email..."
                sx={{
                  mt: 1,
                  borderRadius: "15px",
                  "& input": {
                    fontSize: "0.75rem",
                    color: theme.palette.text.primary,
                  },
                  "& fieldset": {
                    border: "1px solid #0e4a99",
                  },
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}><Typography fontWeight="bold" color={theme.palette.text.main}>
              Phone Number
            </Typography>
              <TextField
                fullWidth
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Phone Number..."
                sx={{
                  mt: 1,
                  borderRadius: "15px",
                  "& input": {
                    fontSize: "0.75rem",
                    color: theme.palette.text.primary,
                  },
                  "& fieldset": {
                    border: "1px solid #0e4a99",
                  },
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }} >
              <Typography fontWeight="bold" color={theme.palette.text.main}>
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password..."
                sx={{
                  mt: 1,
                  borderRadius: "15px",
                  "& input": {
                    fontSize: "0.75rem",
                    color: theme.palette.text.primary,
                  },
                  "& fieldset": {
                    border: "1px solid #0e4a99",
                  },
                  backgroundColor: theme.palette.background.default,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.palette.text.main }}
                      >
                        {showPassword ? <LockOpen /> : <Lock />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" mt={6}>
            <Button
              size="medium"
              variant="contained"
              onClick={handleCreateUser}
              disabled={loading}
              sx={{
                backgroundColor: "rgba(0, 60, 100, 0.96)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgba(0, 60, 100, 0.7)",
                },
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Create"}
            </Button>
          </Grid>
        </Card>
      </Box >
    </>
  )
}

export default AddNewUser
