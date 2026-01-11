import React, { useState, useContext } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CImage,
  CInputGroup, CInputGroupText,
} from '@coreui/react'
import { AuthContext } from '../../context/AuthContext';
import registerImage from "./../../assets/images/flight-login.jpg";
import { useNavigate, Link } from 'react-router-dom'
import logo from "./../../assets/images/logo.png";
import axios from 'axios'
import { register } from '../../services/authService';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons';
import {
  // cilEye,
  cilUser,
  // cilEyeSlash
} from '@coreui/icons'

const Register = () => {
  const { user } = useContext(AuthContext); // to check role
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

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
      setSuccessMsg('Registered successfully!')
      setFormData({ fullName: '', email: '', password: '', role: '', phone: '', })
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg('Registration failed. Try again.')
      }
    } finally {
      setLoading(false)
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
                src={registerImage}
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

            {/* RIGHT – REGISTER FORM */}
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
                    <h4 className="mt-2 mt-md-3 fw-bold fs-5 fs-md-4">Register</h4>
                  </div>
                  <CForm onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <CFormLabel>Full Name</CFormLabel>
                    <CFormInput
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="mb-3"
                      required
                      style={{
                        backgroundColor: "#0F0B1D",
                        border: "1px solid #2E0E99",
                        color: "#fff",
                      }}
                    />

                    {/* Phone Number */}
                    <CFormLabel>Phone Number</CFormLabel>
                    <CFormInput
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 7XX XXX XXX"
                      className="mb-3"
                      required
                      style={{
                        backgroundColor: "#0F0B1D",
                        border: "1px solid #2E0E99",
                        color: "#fff",
                      }}
                    />

                    {/* Role (only if admin) */}
                    {isAdmin && (
                      <>
                        <CFormLabel>Role</CFormLabel>
                        <CFormSelect
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="mb-3"
                          required
                          style={{
                            backgroundColor: "#0F0B1D",
                            border: "1px solid #2E0E99",
                            color: "#fff",
                          }}
                        >
                          <option value="">Select role</option>
                          <option value="admin">Admin</option>
                          <option value="cashier">Cashier</option>
                        </CFormSelect>
                      </>
                    )}

                    {/* Email */}
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="mb-3"
                      required
                      style={{
                        backgroundColor: "#0F0B1D",
                        border: "1px solid #2E0E99",
                        color: "#fff",
                      }}
                    />

                    {/* Password */}
                    <CFormLabel>Password</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="mb-4"
                        required
                        style={{
                          backgroundColor: "#0F0B1D",
                          border: "1px solid #2E0E99",
                          color: "#fff",
                        }}
                      />
                      <CInputGroupText
                        style={{ cursor: 'pointer', backgroundColor: '#0F0B1D', border: '1px solid #2E0E99' }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <CIcon
                          icon={showPassword ? cilLockUnlocked : cilLockLocked}
                          style={{ color: '#fff' }}
                        />
                      </CInputGroupText>
                    </CInputGroup>
                    {/* Feedback */}
                    {errorMsg && <p className="text-danger text-center">{errorMsg}</p>}
                    {successMsg && <p className="text-success text-center">{successMsg}</p>}

                    {/* Submit */}
                    <div className="d-grid mb-3">
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
                        disabled={loading}
                      >
                        {loading ? "Registering..." : "Register"}
                      </CButton>
                    </div>

                    {/* Link to login */}
                    <div
                      className="d-flex justify-content-center align-items-center mt-3"
                      style={{ gap: "4px" }}
                    >
                      <span style={{ color: "#fafafaff", fontSize: "0.85rem" }}>
                        Already have an account?
                      </span>
                      <a
                        href="/login"
                        style={{
                          color: "#3800dfff",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >

                        Login
                      </a>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register