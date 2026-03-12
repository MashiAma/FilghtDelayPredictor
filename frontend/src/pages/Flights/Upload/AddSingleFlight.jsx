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
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { addFlight } from '../../../services/authService';

const flightStatuses = ['Scheduled', 'Delayed', 'Cancelled', 'Departed', "Diverted", 'Arrived'];
const arrivalAirports = [{ code: 'BOM', name: 'Mumbai Chhatrapati Shivaji Maharaj International Airport' },
{ code: 'DEL', name: 'Delhi Indira Gandhi International Airport' },
{ code: 'BLR', name: 'Bangalore Kempegowda International Airport' },
{ code: 'MAA', name: 'Chennai Chennai International Airport' },
{ code: 'HYD', name: 'Hyderabad Rajiv Gandhi International Airport' },

// Pakistan
{ code: 'KHI', name: 'Karachi Jinnah International Airport' },
{ code: 'LHE', name: 'Lahore Allama Iqbal International Airport' },

// Bangladesh
{ code: 'DAC', name: 'Dhaka Hazrat Shahjalal International Airport' },

// Nepal
{ code: 'KTM', name: 'Kathmandu Tribhuvan International Airport' },

// Maldives
{ code: 'MLE', name: 'Malé Velana International Airport' },

    // Bhutan
    // { code: 'PBH', name: 'Paro International Airport' },
];
const airlines = ['SriLankan Airlines', 'Air India', 'IndiGo', 'Emirates', 'FitsAir', 'flydubai', 'Gulf Air'];

const aircrafts = ["A20N", "A21N", "A320", "A321", "A332", "A333", "B38M", "B39M", "B738", "B77W"]

export default function AddSingleFlight() {
    const [form, setForm] = useState({
        flight_number: '',
        airline: '',
        departure_airport: 'CMB',
        arrival_airport: '',
        departure_date: '',
        departure_time: '',
        arrival_date: '',
        arrival_time: '',
        status: '',
        aircraft: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const {
            flight_number,
            airline,
            departure_airport,
            arrival_airport,
            departure_date,
            departure_time,
            arrival_date,
            arrival_time,
            status,
            aircraft,
        } = form;

        if (
            !flight_number ||
            !airline ||
            !departure_airport ||
            !arrival_airport ||
            !departure_date ||
            !departure_time ||
            !arrival_date ||
            !arrival_time ||
            !status ||
            !aircraft
        ) {
            toast.error('All fields are required');
            return;
        }
        const scheduled_departure = new Date(`${departure_date}T${departure_time}`).toISOString();
        const scheduled_arrival = new Date(`${arrival_date}T${arrival_time}`).toISOString();

        const payload = {
            flight_number,
            departure_airport,
            arrival_airport,
            scheduled_departure,
            scheduled_arrival,
            airline,
            status,
            aircraft,
        };

        try {
            setLoading(true);
            await addFlight(payload);
            toast.success('Flight added successfully');
            setForm({
                flight_number: '',
                airline: '',
                departure_airport: 'CMB',
                arrival_airport: '',
                departure_date: '',
                departure_time: '',
                arrival_date: '',
                arrival_time: '',
                status: '',
                aircraft: '',
            });
        } catch (err) {
            toast.error('Failed to add flight');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        label="Flight Number"
                        name="flight_number"
                        fullWidth
                        value={form.flight_number}
                        onChange={handleChange}
                        required
                        size="medium"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth required >
                        <InputLabel>Airline</InputLabel>
                        <Select name="airline" value={form.airline} label="Airline" onChange={handleChange} size="medium">
                            {airlines.map((a) => (
                                <MenuItem key={a} value={a} sx={{ minHeight: 30, py: 0.5 }}>
                                    {a}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        label="Departure Airport"
                        name="departure_airport"
                        fullWidth
                        value={form.departure_airport}
                        onChange={handleChange}
                        required
                        disabled
                        size="medium"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth required >
                        <InputLabel>Arrival Airport</InputLabel>
                        <Select
                            name="arrival_airport"
                            value={form.arrival_airport}
                            label="Arrival Airport"
                            onChange={handleChange}
                            size="medium"
                        >
                            {arrivalAirports.map((a) => (
                                <MenuItem key={a.code} value={a.code} sx={{ minHeight: 30, py: 0.5 }}>
                                    {a.name} ({a.code})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Row 2: 4 fields */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        type="date"
                        label="Departure Date"
                        name="departure_date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.departure_date}
                        onChange={handleChange}
                        required
                        size="medium"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        type="time"
                        label="Departure Time"
                        name="departure_time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.departure_time}
                        onChange={handleChange}
                        required
                        size="medium"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        type="date"
                        label="Arrival Date"
                        name="arrival_date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.arrival_date}
                        onChange={handleChange}
                        required
                        size="medium"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        type="time"
                        label="Arrival Time"
                        name="arrival_time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.arrival_time}
                        onChange={handleChange}
                        required
                        size="medium"
                    />
                </Grid>

                {/* Row 3: Status & Aircraft */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <FormControl fullWidth required>
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={form.status} label="Status" onChange={handleChange} size="medium">
                            {flightStatuses.map((s) => (
                                <MenuItem key={s} value={s} sx={{ minHeight: 30, py: 0.5 }}>
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <FormControl fullWidth required>
                        <InputLabel>Aircraft</InputLabel>
                        <Select name="aircraft" value={form.aircraft} label="Aircraft" onChange={handleChange} size="medium">
                            {aircrafts.map((s) => (
                                <MenuItem key={s} value={s} sx={{ minHeight: 30, py: 0.5 }}>
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* <TextField
                        label="Aircraft"
                        name="aircraft"
                        fullWidth
                        value={form.aircraft}
                        onChange={handleChange}
                        required
                        size="medium"
                    /> */}
                </Grid>
            </Grid>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" mt={6}>
                <Button variant="contained" size="medium" onClick={handleSubmit} disabled={loading} >
                    {loading ? 'Adding Flight…' : 'Add Flight'}
                </Button>
            </Grid>
        </Box>
    );
}
