import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { addHoliday } from '../../../services/authService';

const HOLIDAY_TYPES = [
    "Public Holiday",
    "Religious Holiday",
    "National Holiday",
    "Bank Holiday",
    "School Holiday",
    "Festival",
];

export default function AddSingleHoliday() {
    const [form, setForm] = useState({
        holiday_date: '',
        holiday_name: '',
        holiday_type: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const {
            holiday_date,
            holiday_name,
            holiday_type,
        } = form;

        if (
            !holiday_date ||
            !holiday_name ||
            !holiday_type
        ) {
            toast.error('All fields are required');
            return;
        }

        const payload = {
            holiday_date,
            holiday_name,
            holiday_type,
        };

        try {
            setLoading(true);
            await addHoliday(payload);
            toast.success('Holiday added successfully');
            setForm({
                holiday_date: '',
                holiday_name: '',
                holiday_type: ''
            });
        } catch (err) {
            toast.error('Failed to add holiday');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Grid container spacing={3}>
                {/* Holiday Date */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        type="date"
                        label="Holiday Date"
                        name="holiday_date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.holiday_date}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Holiday Name */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                        label="Holiday Name"
                        name="holiday_name"
                        fullWidth
                        value={form.holiday_name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Vesak Poya Day"
                    />
                </Grid>

                {/* Holiday Type (Autocomplete) */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Autocomplete
                        options={HOLIDAY_TYPES}
                        value={form.holiday_type}
                        onChange={(e, newValue) =>
                            setForm({ ...form, holiday_type: newValue })
                        }
                        // slotProps={{
                        //                     textField: {
                        //                         sx: {
                        //                             '& .MuiOutlinedInput-root': {
                        //                                 fontSize: "11px",
                        //                             },
                        //                             width: "370px"
                        //                         },
                        //                     },
                        //                 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Holiday Type"
                                required

                            />
                        )}
                    />
                </Grid>

                {/* Submit */}
                <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" mt={6}>
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Adding Holiday…" : "Add Holiday"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}