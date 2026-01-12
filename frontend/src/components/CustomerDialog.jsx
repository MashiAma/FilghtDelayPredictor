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
import {
  addItemPrice
} from '../services/authService';
import { toast } from 'react-toastify';

const CustomerDialog = ({ visible, customer, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...customer })
  const [isEditable, setIsEditable] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    setIsEditable(false)
  }
  const toggleEdit = () => {
    setIsEditable((prev) => !prev)
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader style={{ backgroundColor: "#02187dff" }}>
        <CModalTitle style={{ fontWeight: "bold", color: "white" }}>Customer Details</CModalTitle>
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
          <CFormLabel style={{ fontWeight: "bold" }}>Account Number</CFormLabel>
          <CFormInput value={formData.accountNumber} disabled />

          <CFormLabel className="mt-2" style={{ fontWeight: "bold" }}>Name</CFormLabel>
          <CFormInput name="name" disabled={!isEditable} value={formData.name} onChange={handleChange} />

          <CFormLabel className="mt-2" style={{ fontWeight: "bold" }}>Phone</CFormLabel>
          <CFormInput name="phone" type='number' disabled={!isEditable} value={formData.phone} onChange={handleChange} />

          <CFormLabel className="mt-2" style={{ fontWeight: "bold" }}>Email</CFormLabel>
          <CFormInput name="email" disabled value={formData.email} onChange={handleChange} />

          <CFormLabel className="mt-2" style={{ fontWeight: "bold" }}>Address</CFormLabel>
          <CFormInput name="address" disabled={!isEditable} value={formData.address} onChange={handleChange} />
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

export default CustomerDialog
