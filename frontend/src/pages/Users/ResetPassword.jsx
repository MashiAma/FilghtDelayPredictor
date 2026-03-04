import React, { useState } from 'react';
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/images/logo.png';
import resetPasswordImage from './../../assets/images/forget-password.jpg';
import { verifyAndResetPassword, resetPasswordRequest } from '../../services/authService';
import EmailVerificationModal from "./EmailVerificationModal";
import { toast } from 'react-toastify';
import CIcon from '@coreui/icons-react';
import { Visibility, VisibilityOff } from "@mui/icons-material";


const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(email);
      toast.success("Verification code sent");
      setShowVerifyModal(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "User not found");
    }
    finally {
      setLoading(false);
    }
  };

  /* ---------------- Step 2: Verify Code ---------------- */
  const handleCodeVerify = (enteredCode) => {
    setCode(enteredCode);
    setShowVerifyModal(false);
    setStep(2);
  };

  /* ---------------- Step 3: Reset Password ---------------- */
  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error('Please enter your password.');
      return;
    }
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await verifyAndResetPassword({
        email,
        code,
        new_password: newPassword
      });

      toast.success("Password Reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid verification code");
    }
    finally {
      setLoading(false);
    }
  };

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
              src={resetPasswordImage}
              alt="reset"
              sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
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
                top: "1%",
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
              <Typography variant="h6" >
                Predict flight delays using AI
              </Typography>
            </Box>
          </Box>

          {/* RIGHT – LOGIN FORM */}
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
                    Reset Password
                  </Typography>
                </Box>
                {step === 1 && (
                  <Box>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                      margin="normal"
                      InputProps={{
                        sx: {
                          backgroundColor: "#0F0B1D",
                          border: "1px solid #2c568d",
                          color: "#fff",
                          borderRadius: 5,
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #838383, #bdbbbb)",
                        color: "white",
                        height: "40px",
                      }}
                      onClick={handleEmailSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Link
                        href="/login"
                        underline="hover"
                        sx={{ color: "#6d95d1", fontWeight: "bold", fontSize: 12 }}
                      >
                        Login
                      </Link>
                    </Box>
                  </Box>
                )}

                {step === 2 && (
                  <Box>
                    <TextField
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      margin="normal"
                      InputProps={{
                        sx: {
                          backgroundColor: "#0F0B1D",
                          border: "1px solid #2c568d",
                          color: "#fff",
                          borderRadius: 1,
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#fff" }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #838383, #bdbbbb)",
                        color: "#fff",
                        height: "40px",
                      }}
                      onClick={handleResetPassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Card >

        {/* Email Verification Modal */}
        < EmailVerificationModal
          visible={showVerifyModal}
          email={email}
          onVerify={handleCodeVerify}
          onClose={() => setShowVerifyModal(false)}
        />
      </Box >
    </>
  );
};

export default ResetPassword;