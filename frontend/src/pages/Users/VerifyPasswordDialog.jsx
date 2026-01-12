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

            console.log(response.data);
            // Backend returns { success: true }
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
                <DialogTitle>Change Password<IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>

                <DialogContent>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        fullWidth
                        margin="normal"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default VerifyPasswordDialog
