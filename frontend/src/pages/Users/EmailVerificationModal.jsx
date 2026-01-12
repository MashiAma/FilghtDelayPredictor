import React, { useRef, useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
} from '@coreui/react'

const EmailVerificationModal = ({ visible, onClose, onVerify, email }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputs = useRef([])

  useEffect(() => {
    if (visible) {
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    }
  }, [visible])

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      } else if (index > 0) {
        inputs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    const pasteData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (pasteData.length === 6) {
      setCode(pasteData.split(''))
      inputs.current[5]?.focus()
    }
  }

  const handleVerify = () => {
    const enteredCode = code.join('')
    if (enteredCode.length !== 6) return
    onVerify(enteredCode)
  }

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={onClose}
      backdrop="static"
      keyboard={false}
    >
      <CModalHeader>
        <CModalTitle>Email Verification</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <p className="mb-2">Enter the 6-digit code sent to:</p>
        <strong>{email}</strong>

        <div className="d-flex justify-content-center mt-4 gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <CFormInput
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: '45px',
                height: '50px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            />
          ))}
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton
          disabled={code.join('').length !== 6}
          style={{ backgroundColor: '#02187d', color: 'white', fontWeight: 'bold' }}
          onClick={handleVerify}
        >
          Verify
        </CButton>
        <CButton
          style={{ backgroundColor: '#adabad', color: 'black', fontWeight: 'bold' }}
          onClick={onClose}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EmailVerificationModal
