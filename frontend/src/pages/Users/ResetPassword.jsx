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
import logo from './../../assets/images/logo.png';
import resetPasswordImage from './../../assets/resetpassword.jpg';
import { verifyAndResetPassword, resetPasswordRequest } from '../../services/authService';
import EmailVerificationModal from "./EmailVerificationModal";
import { toast } from 'react-toastify';


const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

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

    try {
      await resetPasswordRequest(email);
      toast.success("Verification code sent");
      setShowVerifyModal(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || "User not found");
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

    try {
      await verifyAndResetPassword({
        email,
        code,
        new_password: newPassword
      });

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid verification code");
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
                <h3 className="fw-bold mt-3">Welcome to Sky Guard</h3>
                {/* <h5>Your trusted gateway to knowledge and imagination</h5> */}
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
                  {step === 1 && (
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

                      <div className="d-grid gap-2 mb-1">
                        <CButton className="mt-4 w-100" onClick={handleEmailSubmit}>
                          Send Verification Code
                        </CButton>
                      </div>
                      <div className="text-center mb-3">
                        <a href="/login" className="text-decoration-underline text-muted">
                          Login?
                        </a>
                      </div>
                    </CForm>
                  )}
                  {step === 2 && (
                    <CForm>
                      <CFormLabel>New Password</CFormLabel>
                      <CFormInput
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <CButton className="mt-4 w-100" onClick={handleResetPassword}>
                        Reset Password
                      </CButton>
                    </CForm>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CCol>
        </CRow>
        {/* Email Verification Modal */}
        <EmailVerificationModal
          visible={showVerifyModal}
          email={email}
          onVerify={handleCodeVerify}
          onClose={() => setShowVerifyModal(false)}
        />
      </CContainer>
    </div>
  );
};

export default ResetPassword;