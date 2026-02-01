import React, { useState, useEffect, useContext } from 'react';
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
  Link,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useTheme } from "@mui/material";
import loginImage from "./../../assets/images/flight-login.jpeg";
import logo from "./../../assets/images/logo.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedEmail = Cookies.get('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    setLoading(true)
    try {
      const res = await login({ email, password });
      const { full_name, email: userEmail, phone, role } = res.data;
      // console.log(res.data);
      setUser({
        fullName: full_name,
        email: userEmail,
        phone,
        role,
      });
      setIsLoggedIn(true);
      if (rememberMe) {
        Cookies.set('rememberedEmail', email, { expires: 7 }); // 7 days
      } else {
        Cookies.remove('rememberedEmail');
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log("Login error", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Login failed. Please check your credentials.')
      }
    }
    finally {
      setLoading(false);
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
              src={loginImage}
              alt="login"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
              <Typography variant="body1" sx={{ opacity: 0.75 }}>
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
                    Sign In
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
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
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: "#1c8af1",
                            "&.Mui-checked": { color: "#002442" },
                          }}
                        />
                      }
                      label="Remember me"
                    />
                    <Link
                      href="/reset-password"
                      underline="hover"
                      sx={{ fontSize: "0.75rem", color: "#6d95d1" }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
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
                      "Login"
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
                    <Typography color="#fdfdfd">
                      Don't have an account?
                    </Typography>
                    <Link
                      href="/register"
                      underline="hover"
                      sx={{ fontWeight: "bold", color: "#6d95d1" }}
                    >
                      Sign up
                    </Link>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default Login;