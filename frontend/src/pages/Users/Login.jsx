import React, { Fragment, useState, useEffect, useContext } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CImage,
  CFormLabel
} from '@coreui/react';
// import '@coreui/coreui/dist/css/coreui.min.css';
// import '@coreui/icons/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import loginImage from "./../../assets/images/flight-login.jpg"; // use a flight / airport image
import logo from "./../../assets/images/logo.png";
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
    try {
      const res = await login({ email, password });
      const { full_name, email: userEmail, phone, role } = res.data;
      console.log(res.data);
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
      navigate('/bill-generator', { replace: true });
    } catch (err) {
      console.log("Login error", err);
      toast.error(
        err?.response?.data?.message || 'Login failed. Please check your credentials.',
        { position: 'top-center' }
      );
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(10deg, #d1d1d1ff, #ffffffff)",
        overflow: "hidden",
      }}
    >
      <CContainer fluid className="p-2 p-md-4 h-100">
        <CRow className="justify-content-center align-items-center h-100">
          <CCol
            xs={12}
            md={10}
            className="d-flex flex-column flex-md-row p-0 rounded-4 overflow-hidden shadow-lg"
            style={{
              backgroundColor: "#202020ff",
              minHeight: "70vh",
            }}
          >
            {/* LEFT – IMAGE / BRAND */}
            <CCol
              md={7}
              className="position-relative d-none d-md-block"
              style={{ overflow: "hidden" }}
            >
              <CImage
                src={loginImage}
                //fluid
                className="w-100 h-100 object-fit-cover"
                style={{ opacity: 1 }}
              />

              <div
                className="position-absolute top-0 start-0 w-80 h-80"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(1, 35, 63, 0.84), rgba(187, 187, 187, 0.9))",
                }}
              />

              <div
                className="position-absolute start-50 text-center text-white px-3"
                style={{
                  top: "10%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <h2 className="fw-bold mb-2 fs-4 fs-md-2">
                  SkyGuard
                </h2>
                <p className="opacity-75 fs-6 fs-md-5">
                  Predict flight delays using AI
                </p>
              </div>
            </CCol>

            {/* RIGHT – LOGIN FORM */}
            <CCol
              xs={12}
              md={5}
              className="d-flex align-items-center justify-content-center p-3 p-md-4"
            >
              <CCard
                className="w-100 border-0"
                style={{
                  background: "rgba(7, 0, 107, 0.62)",
                  backdropFilter: "blur(18px)",
                  borderRadius: "20px",
                }}
              >
                <CCardBody className="px-3 px-md-5 py-4 text-white">
                  <div className="text-center mb-3 mb-md-4">
                    <CImage src={logo} height={40} />
                    <h4 className="mt-2 mt-md-3 fw-bold fs-5 fs-md-4">Sign In</h4>
                  </div>

                  <CForm onSubmit={handleSubmit}>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      placeholder="pilot@airline.com"
                      className="mb-2 mb-md-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        backgroundColor: "#0F0B1D",
                        border: "1px solid #2E0E99",
                        color: "#fff",
                      }}
                    />

                    <CFormLabel>Password</CFormLabel>
                    <CFormInput
                      type="password"
                      placeholder="••••••••"
                      className="mb-2 mb-md-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        backgroundColor: "#0F0B1D",
                        border: "1px solid #2E0E99",
                        color: "#fff",
                      }}
                    />

                    <div className="d-flex align-items-center mb-2 mb-md-3" style={{ justifyContent: "space-between" }}>
                      <div className="d-flex align-items-center"><input
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                          setRememberMe(e.target.checked)
                        }
                      />
                        <label className="form-check-label text-secondary">
                          Remember me
                        </label>
                      </div>
                      <a
                        href="/reset-password"
                        style={{
                          color: "#3800dfff",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <CButton
                      type="submit"
                      className="w-100 fw-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #838383ff, #bdbbbbff)",
                        border: "none",
                        padding: "5px 0",
                        fontSize: "0.95rem",
                      }}
                    // onClick={handleSubmit}
                    >
                      Login
                    </CButton>

                    <div
                      className="d-flex justify-content-center align-items-center mt-3"
                      style={{ gap: "4px" }}
                    >
                      <span style={{ color: "#fafafaff", fontSize: "0.85rem" }}>
                        Don't have an account?
                      </span>
                      <a
                        href="/register"
                        style={{
                          color: "#3800dfff",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        Sign up
                      </a>
                    </div>
                    {/* <a
                        href="http://localhost:5173/"
                        style={{
                          color: "#fafafaff",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        Main Page
                      </a> */}

                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default Login;