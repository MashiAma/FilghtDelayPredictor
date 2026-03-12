import React, { useState, useContext } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link
} from "@mui/material";
import { AuthContext } from '../../context/AuthContext';
import registerImage from "./../../assets/images/flight-register.webp";
import { useNavigate } from 'react-router-dom'
import logo from "./../../assets/images/logo.png";
import { register } from '../../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
  const { user } = useContext(AuthContext); // to check role
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!formData.email) {
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.phone) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true)

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      // Only admin can assign roles
      if (isAdmin && formData.role) {
        payload.role = formData.role;
      }

      await register(payload);
      toast.success('Registered successfully!')
      setFormData({ fullName: '', email: '', password: '', role: '', phone: '', })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Registration failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(10deg, #d1d1d1, #ffffff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: 2,
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "90%",
            maxWidth: 1000,
            borderRadius: 4,
            overflow: "hidden",
            minHeight: "70vh",
            boxShadow: 5,
          }}
        >
          {/* LEFT - Image */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: 7,
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={registerImage}
              alt="register"
              sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "80%",
                height: "80%",
                // background:
                //   "linear-gradient(135deg, rgb(0, 45, 104), rgba(187,187,187,0.6))",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "white",
                zIndex: 2,
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                SkyGuard
              </Typography>
              <Typography variant="h6">
                Predict flight delays using AI
              </Typography>
            </Box>
          </Box>

          {/* RIGHT - Login Form */}
          <Box
            sx={{
              flex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, md: 3 },
              background: "rgb(255, 255, 255)",

              backdropFilter: "blur(18px)",
            }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: 3,
                p: 1,
                background: "rgba(0, 60, 100, 0.96)",
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 0 }}>
                <Box mb={2}>
                  <Box
                    component="img"
                    src={logo}
                    alt="logo"
                    sx={{ height: 35, mb: 0 }}
                  />
                  <Typography variant="h5" fontWeight="bold">
                    Sign Up
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <TextField
                    name="fullName"
                    label="Full Name"
                    type="text"
                    fullWidth
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter Your Full Name"
                    margin="normal"
                    required
                    InputProps={{
                      sx: {
                        backgroundColor: "rgb(0, 14, 66)",
                        border: "1px solid #2c568d",
                        color: "#fff",
                        borderRadius: 5,
                        // '& .MuiOutlinedInput-root': {
                        //   py: 0,
                        //   height: 35,
                        //   display: 'flex',
                        //   alignItems: 'center',
                        //   fontSize: "11px"
                        // },
                      },
                    }}
                  />
                  <TextField
                    name="phone"
                    label="Phone Number"
                    type="tel" // allows numeric input on mobile too
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // remove non-numeric characters
                      setFormData((prev) => ({ ...prev, phone: value }));
                    }}
                    placeholder="Enter Phone Number - (0700000000)"
                    margin="normal"
                    inputProps={{ maxLength: 10 }}
                    required
                    InputProps={{
                      sx: {
                        backgroundColor: "rgb(0, 14, 66)",
                        border: "1px solid #2c568d",
                        color: "#fff",
                        borderRadius: 5,
                      },
                    }}
                  />

                  {/* {isAdmin && (
                    <>
                      <CFormLabel>Role</CFormLabel>
                      <CFormSelect
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mb-2"
                        required
                        margin="normal"
                        style={{
                          backgroundColor: "#0F0B1D",
                          border: "1px solid #2c568d",
                          color: "#fff",
                        }}
                      >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="cashier">Cashier</option>
                      </CFormSelect>
                    </>
                  )} */}

                  {/* Email */}
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    required
                    margin="normal"
                    InputProps={{
                      sx: {
                        backgroundColor: "rgb(0, 14, 66)",
                        border: "1px solid #2c568d",
                        color: "#fff",
                        borderRadius: 5,
                      },
                    }}
                  />

                  {/* Password */}
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    sx={{ mt: "15px" }}
                    InputProps={{
                      sx: {
                        backgroundColor: "rgb(0, 14, 66)",
                        border: "1px solid #2c568d",
                        color: "#fff",
                        borderRadius: 5,

                      },
                    }}
                  />
                  {/* Submit */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 5,
                      py: 1.5,
                      fontWeight: "bold",
                      height: "40px",
                      // width: "200px",
                      background: "linear-gradient(135deg, #a5a5a5, #bdbbbb)",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: "#6d95d1" }} />
                    ) : (
                      "Register"
                    )}
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                      gap: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    <Typography sx={{ color: "#ffffff" }}>
                      Already have an account?
                    </Typography>
                    <Link
                      href="/login"
                      underline="hover"
                      sx={{ fontWeight: "bold", color: "#6d95d1" }}
                    >
                      Login
                    </Link>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Card >
      </Box >
    </>
  )
}

export default Register