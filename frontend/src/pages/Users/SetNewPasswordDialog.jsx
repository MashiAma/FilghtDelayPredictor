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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from '../../context/AuthContext';
import { changePassword } from "../../services/authService";
import { useNavigate } from 'react-router-dom';

export default function SetNewPasswordDialog({ open, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: user.email,
        // old_password: "",
        new_password: "",
        confirm_new_password: "",
    });
    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.new_password || !form.confirm_new_password) {
            toast.error("All fields are required");
            return;
        }
        if (form.new_password !== form.confirm_new_password) {
            toast.error("Passwords do not match");
            return;
        }
        const passwordRegex = /^.{6,}$/;
        if (!passwordRegex.test(form.new_password)) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);
            await changePassword(form);
            toast.success("Password updated successfully");
            onClose();
            logout();
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Password update failed");
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
                        Set New Password
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
                        type="password"
                        label="New Password"
                        name="new_password"
                        margin="normal"
                        size='small'
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        type="password"
                        label="Confirm New Password"
                        name="confirm_new_password"
                        margin="normal"
                        size='small'
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{
                            backgroundColor: "rgba(0, 60, 100, 0.96)", border: "none",
                            fontSize: "0.85rem", color: 'white', fontWeight: 'bold'
                        }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Update Password"}
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
