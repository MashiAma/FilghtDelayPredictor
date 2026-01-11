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

const flightStatuses = ['Scheduled', 'Delayed', 'Cancelled', 'Departed', 'Arrived'];
const arrivalAirports = ['BOM', 'DEL', 'MLE', 'PBH'];
const airlines = ['SriLankan', 'Air India', 'Thai Airways', 'Singapore Airlines'];

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
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 1 }}>
            <Grid container spacing={2}>
                {/* Flight Number */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Flight Number"
                        name="flight_number"
                        fullWidth
                        value={form.flight_number}
                        onChange={handleChange}
                        required
                        sx={{ width: "180px" }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth required sx={{ width: "180px" }}>
                        <InputLabel>Airline</InputLabel>
                        <Select name="airline" value={form.airline} label="Airline" onChange={handleChange}>
                            {airlines.map((a) => (
                                <MenuItem key={a} value={a}>
                                    {a}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Departure Airport"
                        name="departure_airport"
                        fullWidth
                        value={form.departure_airport}
                        onChange={handleChange}
                        required
                        disabled
                        sx={{ width: "180px" }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth required sx={{ width: "180px" }}>
                        <InputLabel>Arrival Airport</InputLabel>
                        <Select
                            name="arrival_airport"
                            value={form.arrival_airport}
                            label="Arrival Airport"
                            onChange={handleChange}
                        >
                            {arrivalAirports.map((airport) => (
                                <MenuItem key={airport} value={airport}>
                                    {airport}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Row 2: 4 fields */}
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="Departure Date"
                        name="departure_date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.departure_date}
                        onChange={handleChange}
                        required
                        sx={{ width: "180px" }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="time"
                        label="Departure Time"
                        name="departure_time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.departure_time}
                        onChange={handleChange}
                        required
                        sx={{ width: "180px" }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="Arrival Date"
                        name="arrival_date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.arrival_date}
                        onChange={handleChange}
                        required
                        sx={{ width: "180px" }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="time"
                        label="Arrival Time"
                        name="arrival_time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.arrival_time}
                        onChange={handleChange}
                        required
                        sx={{ width: "180px" }}
                    />
                </Grid>

                {/* Row 3: Status & Aircraft */}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth required sx={{ width: "375px" }}>
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={form.status} label="Status" onChange={handleChange}>
                            {flightStatuses.map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Aircraft"
                        name="aircraft"
                        fullWidth
                        value={form.aircraft}
                        onChange={handleChange}
                        required
                        sx={{ width: "375px" }}
                    />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ justifyContent: "flex-end" }}>
                    <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading} >
                        {loading ? 'Adding Flight…' : 'Add Flight'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
