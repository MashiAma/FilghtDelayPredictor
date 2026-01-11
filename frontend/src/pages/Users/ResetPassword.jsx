import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CImage,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import '@coreui/icons/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import logo from './../../assets/images/logo.png';
import resetPasswordImage from './../../assets/resetpassword.jpg';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    try {
      const res = await resetPassword({ email, password });
      toast.success('Password reset successful!', { autoClose: 2000 });
      navigate('/login');
    } catch (err) {
      console.error("Reset error:", err);
      toast.error('Password reset failed. Please try again.', { autoClose: 3000 });
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-white"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <CContainer fluid className="p-4" style={{ height: '100%' }}>
        <CRow className="justify-content-center" style={{ height: '100%' }}>
          <CCol
            md={10}
            className="d-flex p-0 rounded overflow-hidden border border-2 border-white shadow"
            style={{ backgroundColor: 'white', height: '100%' }}
          >
            <CCol
              md={7}
              className="p-0 position-relative bg-white"
              style={{ overflow: 'hidden', height: '100%' }}
            >
              <CImage
                fluid
                src={resetPasswordImage}
                alt="Sample"
                className="w-95 h-95 object-fit-cover"
                style={{
                  marginTop: "80px",
                  borderTopLeftRadius: '20px',
                  borderBottomLeftRadius: '20px',
                }}
              />

              <div
                className="position-absolute top-0 start-50 text-center text-blue p-1"
                style={{
                  zIndex: 2,
                  textShadow: '1px 1px 1px rgba(158, 157, 157, 0.7)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '90vw',
                  transform: 'translateX(-50%)',
                }}
              >
                <h3 className="fw-bold mt-3">Welcome to Pahana Edu</h3>
                <h5>Your trusted gateway to knowledge and imagination</h5>
              </div>

              <div
                className="position-absolute bottom-0 start-50 text-blue text-center px-0 mb-4"
                style={{
                  zIndex: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '90vw',
                  transform: 'translateX(-50%)'
                }}
              >
                <p className="mb-0">
                  We are your trusted destination for quality books and school accessories.</p>
                {/* <p className="mb-0">   We bring everything you need to make learning brighter and more enjoyable.</p> */}
              </div>
            </CCol>

            <CCol
              md={5}
              className="d-flex align-items-start justify-content-center p-4"
              style={{ height: '100vh' }}
            >
              <CCard className="w-100 border-0">
                <CCardBody className="px-5 pt-3 pb-4">
                  <div className="text-center mb-3">
                    <CImage src={logo} height={70} alt="Logo" />
                    <h4 className="mt-4">Reset Password</h4>
                  </div>
                  <CForm>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      value={email}
                      id="email"
                      placeholder="Email (Username)"
                      className="mb-3"
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <CFormLabel htmlFor="password">Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="mb-5"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="d-grid gap-2 mb-1">
                      <CButton style={{ backgroundColor: '#00008A', borderColor: '#00008A', color: "white", fontWeight: "bold" }} onClick={handleSubmit}>
                        Reset Password
                      </CButton>
                    </div>


                    <div className="text-center mb-3">
                      <a href="/login" className="text-decoration-underline text-muted">
                        Login?
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
  );
};

export default ResetPassword;