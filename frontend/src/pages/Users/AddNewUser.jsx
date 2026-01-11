import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CContainer
} from '@coreui/react'
import { toast } from 'react-toastify';
import { register } from '../../services/authService';

const AddNewUser = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('normal')


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

    try {
      const response = await register(newUser);

      toast.success('User added successfully!');
      console.log('Created user:', response.data);

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
  };

  return (
    <>
      <CContainer className="mt-0">
        <CCard style={{ minHeight: '445px' }}>
          <CCardHeader className="d-flex justify-content-between align-items-center py-2 px-3" style={{ backgroundColor: "#02187dff" }}>
            <h5 style={{ color: "#f5f6faff", fontWeight: "bolder" }}>Create New User</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              {/* Full Name and Role in same row */}
              <CRow className="mb-3">
                <CCol md={8}>
                  <CFormLabel htmlFor="fullName" style={{ fontWeight: "bold" }}>Full Name</CFormLabel>
                  <CFormInput
                    style={{ minHeight: '40px' }}
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Full Name..."
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="role" style={{ fontWeight: "bold" }}>Role</CFormLabel>
                  <CFormSelect
                    style={{ minHeight: '40px' }}
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="normal">Normal</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Email */}
              <CRow className="mb-3">
                <CCol md={8}>
                  <CFormLabel htmlFor="email" style={{ fontWeight: "bold" }}>Email</CFormLabel>
                  <CFormInput
                    style={{ minHeight: '40px' }}
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email..."
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="phone" style={{ fontWeight: "bold" }}>Phone Number</CFormLabel>
                  <CFormInput
                    style={{ minHeight: '40px' }}
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Phone Number..."
                  />
                </CCol>
              </CRow>

              {/* Password */}
              <CRow className="mb-4">
                <CCol md={12}>
                  <CFormLabel htmlFor="password" style={{ fontWeight: "bold" }}>Password</CFormLabel>
                  <CFormInput
                    style={{ minHeight: '40px' }}
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password..."
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={50} className="d-flex justify-content-end mt-4">
                  <CButton style={{ backgroundColor: "#02187dff", color: "#fcfcfdff", fontWeight: "bold", width: '150px', marginTop: "20px" }} onClick={handleCreateUser}>
                    Create
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </>
  )
}

export default AddNewUser
