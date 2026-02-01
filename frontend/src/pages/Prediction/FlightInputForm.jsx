import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    InputLabel,
    FormControl,
    Select,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Sample data for Arrival Airports and Airlines
const ARRIVAL_AIRPORTS = [
    { code: 'JFK', name: 'John F. Kennedy, New York' },
    { code: 'LHR', name: 'London Heathrow' },
    { code: 'DXB', name: 'Dubai International' },
];

const AIRLINES = ['SriLankan Airlines', 'Emirates', 'British Airways'];

const SCHEDULED_FLIGHTS = [
    { departure_time: '2026-01-15T07:55:00', arrival: 'JFK', airline: 'SriLankan Airlines' },
    { departure_time: '2026-01-15T15:30:00', arrival: 'JFK', airline: 'Emirates' },
    { departure_time: '2026-01-16T09:00:00', arrival: 'LHR', airline: 'British Airways' },
    // Add more as needed
];

const FlightInputForm = () => {
    const [arrival, setArrival] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [departureTimes, setDepartureTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [airline, setAirline] = useState('');
    const [flightNumber, setFlightNumber] = useState('');

    // Update departure times based on selected Arrival and Date
    useEffect(() => {
        if (arrival && selectedDate) {
            const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
            const filteredTimes = SCHEDULED_FLIGHTS.filter(
                (f) => f.arrival === arrival && f.departure_time.startsWith(dateStr)
            ).map((f) => ({
                time: dayjs(f.departure_time).format('HH:mm'),
                airline: f.airline,
            }));
            setDepartureTimes(filteredTimes);
            setSelectedTime(filteredTimes.length ? filteredTimes[0].time : '');
            setAirline(filteredTimes.length ? filteredTimes[0].airline : '');
        } else {
            setDepartureTimes([]);
            setSelectedTime('');
            setAirline('');
        }
    }, [arrival, selectedDate]);

    const handleSubmit = () => {
        if (!arrival || !selectedDate || !selectedTime) {
            alert('Please fill all required fields');
            return;
        }
        const data = {
            departure: 'CMB', // fixed
            arrival,
            departure_date: dayjs(selectedDate).format('YYYY-MM-DD'),
            departure_time: selectedTime,
            airline,
            flight_number: flightNumber || 'N/A',
        };
        console.log('User Input:', data);
        alert('Flight details submitted! Check console for data.');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Flight Delay Prediction
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {/* Departure Airport */}
                    <Grid item xs={12}>
                        <TextField
                            label="Departure Airport"
                            value="CMB"
                            fullWidth
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    {/* Arrival Airport */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Arrival Airport</InputLabel>
                            <Select
                                value={arrival}
                                onChange={(e) => setArrival(e.target.value)}
                                label="Arrival Airport"
                            >
                                {ARRIVAL_AIRPORTS.map((a) => (
                                    <MenuItem key={a.code} value={a.code}>
                                        {a.name} ({a.code})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Departure Date */}
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Departure Date"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                minDate={dayjs()}
                                maxDate={dayjs().add(15, 'day')}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Departure Time */}
                    <Grid item xs={12}>
                        <FormControl fullWidth disabled={!departureTimes.length}>
                            <InputLabel>Departure Time</InputLabel>
                            <Select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                label="Departure Time"
                            >
                                {departureTimes.map((f, idx) => (
                                    <MenuItem key={idx} value={f.time}>
                                        {f.time} ({f.airline})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Airline */}
                    <Grid item xs={12}>
                        <FormControl fullWidth disabled>
                            <InputLabel>Airline</InputLabel>
                            <Select value={airline} label="Airline">
                                {airline && <MenuItem value={airline}>{airline}</MenuItem>}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Flight Number (optional) */}
                    <Grid item xs={12}>
                        <TextField
                            label="Flight Number (optional)"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{ py: 1.5 }}
                        >
                            Predict Delay
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default FlightInputForm;
