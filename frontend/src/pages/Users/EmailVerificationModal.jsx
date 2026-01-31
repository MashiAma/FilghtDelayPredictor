import React, { useRef, useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Stack,
  Box
} from "@mui/material";

const EmailVerificationModal = ({
  visible,
  onClose,
  onVerify,
  email,
}) => {
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
    <Dialog
      open={visible}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "rgba(0, 64, 107, 0.91)",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem"
        }}
      >
        Email Verification
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" mb={1}>
          Enter the 6-digit code sent to:
        </Typography>

        <Typography fontWeight="bold" mb={3}>
          {email}
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          onPaste={handlePaste}
        >
          {code.map((digit, index) => (
            <TextField
              key={index}
              value={digit}
              inputRef={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "rgba(0, 64, 107, 0.91)"
                }
              }}
              sx={{
                width: 45,
                "& .MuiOutlinedInput-root": {
                  height: 50
                }
              }}
            />
          ))}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          disabled={code.join("").length !== 6}
          onClick={handleVerify}
          sx={{
            background: "rgba(0, 64, 107, 0.91)",
            fontSize: "0.85rem",
            fontWeight: "bold",
            "&:hover": {
              background: "rgba(0, 64, 107, 0.91)"
            }
          }}
        >
          Verify
        </Button>

        <Button
          onClick={onClose}
          sx={{
            background: "linear-gradient(135deg, #838383, #bdbbbb)",
            color: "black",
            fontSize: "0.85rem",
            fontWeight: "bold"
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmailVerificationModal
