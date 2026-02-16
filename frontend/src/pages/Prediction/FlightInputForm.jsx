import React, { useState, useEffect, useContext } from 'react';
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
    useTheme,
    Card,
    CircularProgress,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { fetchDepartureTimes, submitPrediction } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

// Sample data for Arrival Airports and Airlines
const ARRIVAL_AIRPORTS = [
    // India
    { code: 'BOM', name: 'Mumbai Chhatrapati Shivaji Maharaj International Airport' },
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

const AIRLINES = ['SriLankan Airlines', 'Air India', 'IndiGo', 'Emirates', 'fitsAir', 'flydubai', 'Gulf Air'];

const FlightInputForm = () => {
    const [arrival, setArrival] = useState('');
    const [airline, setAirline] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [departureTimes, setDepartureTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [flightNumber, setFlightNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    const [loadingTimes, setLoadingTimes] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!arrival || !airline || !selectedDate) return;

        setLoadingTimes(true);
        setDepartureTimes([]);
        setSelectedTime("");

        fetchDepartureTimes({
            arrival,
            airline,
            flight_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        })
            .then((res) => {
                setDepartureTimes(res.data);
            })
            .finally(() => setLoadingTimes(false));
    }, [arrival, airline, selectedDate]);

    // const handleSubmit = () => {
    //     const payload = {
    //         departure_airport: "CMB",
    //         arrival_airport: arrival,
    //         airline,
    //         departure_datetime: `${dayjs(selectedDate).format("YYYY-MM-DD")} ${selectedTime}:00`,
    //     };

    //     console.log("Prediction input:", payload);
    // };
    const handlePredict = async () => {
        setLoading(true);
        setResult(null);

        const payload = {
            user_email: user.email,
            arrival_airport: arrival,
            airline,
            flight_number: flightNumber || null,
            departure_date: dayjs(selectedDate).format("YYYY-MM-DD"),
            departure_time: selectedTime,
        };
        console.log('User Input:', payload);
        try {
            const res = await submitPrediction(payload);
            console.log(res.data)
            setResult(res.data);
        } finally {
            setLoading(false);
        }
    };


    // const handleSubmit = () => {
    //     if (!arrival || !selectedDate || !selectedTime) {
    //         alert('Please fill all required fields');
    //         return;
    //     }
    //     const data = {
    //         departure: 'CMB', // fixed
    //         arrival,
    //         departure_date: dayjs(selectedDate).format('YYYY-MM-DD'),
    //         departure_time: selectedTime,
    //         airline,
    //         flight_number: flightNumber || 'N/A',
    //     };
    //     console.log('User Input:', data);
    //     alert('Flight details submitted! Check console for data.');
    // };

    return (
        <>
            <Box p={3}>
                <Typography variant="h5" style={{
                    border: "none",
                    fontSize: "1.2rem",
                    fontWeight: 'bold',
                    color: theme.palette.text.main,
                }}>
                    Flight Delay Prediction
                </Typography>
                <Card sx={{ mt: "20px", p: 3 }}>
                    <Box component="form" noValidate autoComplete="off" >
                        <Grid container spacing={3}>
                            {/* Departure Airport */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Departure Airport"
                                    value="CMB"
                                    fullWidth
                                    disabled
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* Arrival Airport */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Arrival Airport</InputLabel>
                                    <Select
                                        value={arrival}
                                        onChange={(e) => setArrival(e.target.value)}
                                        label="Arrival Airport"
                                    // sx={{
                                    //     mt: 1,
                                    //     mb: 1.5,
                                    //     height: 35,
                                    //     '& .MuiOutlinedInput-root': {
                                    //         py: 0,
                                    //         height: 35,
                                    //         display: 'flex',
                                    //         alignItems: 'center',
                                    //         fontSize: "11px"
                                    //     },
                                    // }}
                                    >
                                        {ARRIVAL_AIRPORTS.map((a) => (
                                            <MenuItem key={a.code} value={a.code} sx={{ minHeight: 30, py: 0.5 }}>
                                                {a.name} ({a.code})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Flight Number (optional)"
                                    value={flightNumber}
                                    onChange={(e) => setFlightNumber(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            {/* Departure Date */}


                            {/* Airline */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth
                                //disabled
                                >
                                    <InputLabel>Airline</InputLabel>
                                    <Select value={airline} onChange={(e) => setAirline(e.target.value)}>
                                        {AIRLINES.map((a) => (
                                            <MenuItem key={a} value={a}>{a}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Departure Date"
                                        fullWidth
                                        value={selectedDate}
                                        onChange={(newValue) => setSelectedDate(newValue)}
                                        minDate={dayjs()}
                                        maxDate={dayjs().add(15, 'day')}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        fontSize: "11px",
                                                    },
                                                    width: "440px"
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Departure Time */}
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth disabled={!departureTimes.length}>
                                    <InputLabel>
                                        {loadingTimes ? "Loading times..." : "Departure Time"}
                                    </InputLabel>
                                    <Select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    >
                                        {departureTimes.map((t, i) => (
                                            <MenuItem key={i} value={t.departure_time}>
                                                {t.departure_time}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Submit */}
                            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" mt={3}>
                                <Button variant="contained"
                                    size="medium"
                                    color="primary"
                                    disabled={!selectedTime || loading}
                                    onClick={handlePredict}
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? <CircularProgress size={22} /> : "Predict Delay"}
                                </Button>
                            </Grid>
                        </Grid>
                        {result && (
                            <Box mt={4}>
                                <Typography fontWeight="bold">Prediction Result</Typography>
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Box >
        </>
    );
};

export default FlightInputForm;
