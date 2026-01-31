import React, { useState, useContext } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    IconButton,
    Alert,
    Box,
} from '@mui/material'

import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from '../../context/AuthContext'
import { verifyPassword } from '../../services/authService'
import { toast } from 'react-toastify';

const VerifyPasswordDialog = ({ open, onClose, onVerified }) => {
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('')
    const [error, setError] = useState('')
    const [verified, setVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleVerify = async () => {
        if (!currentPassword) {
            setError("Please enter your current password");
            return;
        }

        try {
            setLoading(true);

            const response = await verifyPassword({ email, password: currentPassword });

            //console.log(response.data);
            if (response.data?.success) {
                toast.success("Password verified");
                setCurrentPassword("");  // clear input
                onVerified();
            }
        } catch (err) {
            setError(err?.response?.data?.detail || "Verification failed 1");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <Box style={{
                    backgroundColor: "rgba(0, 60, 100, 0.96)",
                }}>
                    <DialogTitle style={{
                        border: "none",
                        fontSize: "1.2rem", color: 'white', fontWeight: 'bold'
                    }}>
                        Change Password
                        <IconButton
                            onClick={onClose}
                            sx={{ position: "absolute", right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                </Box>

                <DialogContent>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        fullWidth
                        margin="normal"
                        size='small'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={currentPassword}
                        size='small'
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "rgba(0, 60, 100, 0.96)", border: "none",
                            fontSize: "0.85rem", color: 'white', fontWeight: 'bold'
                        }}
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                    <Button style={{
                        background:
                            "linear-gradient(135deg, #838383ff, #bdbbbbff)",
                        border: "none",
                        fontSize: "0.85rem",
                        fontWeight: 'bold',
                        color: "black"
                    }} onClick={onClose}>Cancel</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}

export default VerifyPasswordDialog
