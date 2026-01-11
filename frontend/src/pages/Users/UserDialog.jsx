import React, { useState } from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
} from '@coreui/icons';
import { CBadge } from '@coreui/react'
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
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader style={{ backgroundColor: "#02187dff" }}>
        <CModalTitle style={{ fontWeight: "bold", color: "white" }}>User Details</CModalTitle>
        <CTooltip content={isEditable ? 'Disable Editing' : 'Enable Editing'}>
          <CButton
            color="light"
            className="ms-2"
            onClick={toggleEdit}
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <CIcon icon={cilPencil} />
          </CButton>
        </CTooltip>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel style={{ fontWeight: "bold" }}>Email</CFormLabel>
              <CFormInput value={email} disabled />
            </CCol>
            <CCol md={6}>
              <CFormLabel style={{ fontWeight: "bold" }}>Role</CFormLabel>
              <CFormInput
                value={role}
                disabled
              />
            </CCol>
          </CRow>
          <div className="mb-3">
            <CFormLabel style={{ fontWeight: "bold" }}>Full Name</CFormLabel>
            <CFormInput
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditable}
            />
          </div>

          <div className="mb-3">
            <CFormLabel style={{ fontWeight: "bold" }}>Phone Number</CFormLabel>
            <CFormInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditable}
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton style={{ backgroundColor: "#adabadff", fontWeight: "bold", color: "black" }} onClick={onClose}>
          Cancel
        </CButton>
        <CButton style={{ backgroundColor: "#02187dff", fontWeight: "bold", color: "white" }} onClick={handleSave} disabled={!isEditable}>
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserDialog;
