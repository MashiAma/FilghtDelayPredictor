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
    LinearProgress,
    Stack
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { fetchDepartureTimes, submitPrediction } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DescriptionIcon from "@mui/icons-material/Description";
import InsightsIcon from "@mui/icons-material/Insights";
import PeopleIcon from "@mui/icons-material/People";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Chip from '@mui/material/Chip';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

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

const AIRLINES = ['SriLankan Airlines', 'Air India', 'IndiGo', 'Emirates', 'FitsAir', 'flydubai', 'Gulf Air'];
const featureLabelMap = {
    destination_code: "Destination Airport",
    scheduled_month: "Seasonal Travel Patterns",
    route_avg_delay: "Historical delay trend for the route",
    dep_wind_speed_10m: "Wind conditions at departure airport",
    aircraft_type: "Aircraft Model"
};

// Custom Gauge Component using CSS
const PredictionGauge = ({ value }) => {
    const color = value > 60 ? '#ff4d4d' : value > 30 ? '#ffcc00' : '#4caf50';
    return (
        <Box textAlign="center" position="relative" display="inline-flex">
            <CircularProgress
                variant="determinate"
                value={value}
                size={120}
                thickness={5}
                sx={{ color: color, filter: 'drop-shadow(0px 0px 8px rgba(0,0,0,0.5))' }}
            />
            <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Typography variant="h4" fontWeight="bold" color="white">{value}%</Typography>
                <Typography variant="caption" color="gray">Delay Risk</Typography>
            </Box>
        </Box>
    );
};

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

    // Glassmorphism Style
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    };

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
                    fontSize: "1.4rem",
                    fontWeight: 'bold',
                    color: theme.palette.text.main,
                }}>
                    Dashboard
                </Typography>
                <Card sx={{ ...glassStyle, mt: "20px", p: 3 }}>
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
                        {/* {result && (
                            <Box mt={4}>
                                <Typography fontWeight="bold">Prediction Result</Typography>
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </Box>
                        )} */}
                        {result && (
                            <>
                                <Typography fontWeight="bold" fontSize="1.3rem" color={theme.palette.text.main}>Detailed Delay Analysis</Typography>
                                <Grid container spacing={3} mt={4}>

                                    {/* Delay Risk */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3, height: "100%" }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <WarningAmberIcon sx={{ color: "#ffcc00" }} />
                                                <Typography variant="h5" fontWeight="bold" fontSize="1.1rem">Delay Risk</Typography>
                                            </Box>

                                            <Box display="flex" alignItems="center" justifyContent="space-around">
                                                <PredictionGauge value={(result.dep_probability * 100).toFixed(0)} color="#00e6ac" />

                                                <Box marginLeft={0} maxWidth={250}>
                                                    <Typography variant="h6" color="#ffcc00" fontWeight="bold">
                                                        {result.delay_class_dep}
                                                    </Typography>

                                                    {/* <Typography variant="body1">
                                                    {(result.dep_probability * 100).toFixed(0)}% probability
                                                </Typography> */}

                                                    <Typography variant="caption" >
                                                        {result.confidence_explanation}
                                                    </Typography>
                                                </Box>
                                                <Box marginLeft={0}>
                                                    {result.top_features?.length > 0 && (
                                                        <Box mt={2}>
                                                            <Typography variant="subtitle2" fontWeight="bold" color="#ffcc00">Top Prediction Insights</Typography>
                                                            <Stack spacing={0.5} mt={0}>
                                                                {result.top_features.map(([feature], index) => (
                                                                    <Typography key={index} variant="body1">
                                                                        • {featureLabelMap[feature] || feature}
                                                                    </Typography>
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                </Box>


                                            </Box>
                                        </Card>
                                    </Grid>


                                    {/* Operational Narrative */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3, height: "100%" }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <DescriptionIcon sx={{ color: "#66d9ff" }} />
                                                <Typography variant="h5" fontWeight="bold" fontSize="1.1rem">
                                                    AI Operational Narrative
                                                </Typography>
                                            </Box>
                                            <Typography>
                                                {result.narrative}
                                            </Typography>

                                        </Card>
                                    </Grid>


                                    {/* Delay Factors */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3 }}>

                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <InsightsIcon sx={{ color: "#00e6ac" }} />
                                                <Typography fontWeight="bold" fontSize="1.1rem">
                                                    Delay Factors
                                                </Typography>
                                            </Box>


                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold" color="#00e6ac">Weather</Typography>
                                                        <Typography variant="body1" >
                                                            {result.reason_breakdown.weather}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold" color="#00e6ac">Holiday / Congestion</Typography>
                                                        <Typography variant="body1" >
                                                            {result.reason_breakdown.holiday_congestion}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold" color="#00e6ac">Route History</Typography>
                                                        <Typography variant="body1" >
                                                            {result.reason_breakdown.route_history}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold" color="#00e6ac">Schedule</Typography>
                                                        <Typography variant="body1">
                                                            {result.reason_breakdown.schedule}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                {/* Top Features / Prediction Insights */}

                                            </Box>
                                        </Card>
                                    </Grid>

                                    {/* Passenger Impact */}

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3, minHeight: 295 }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <PeopleIcon sx={{ color: "#ff80bf" }} />
                                                <Typography fontWeight="bold" fontSize="1.1rem">
                                                    Passenger Impact
                                                </Typography>
                                            </Box>

                                            {/* Main impact description */}
                                            <Typography variant="body1" mb={2}>
                                                {result.passenger_impact}
                                            </Typography>

                                            {/* Inconvenience score */}
                                            {result.inconvenience_label && (
                                                <Box mb={1}>
                                                    <Typography variant="subtitle2" color="#ff80bf" fontWeight="bold">Inconvenience Level</Typography>
                                                    <Typography variant="body1">
                                                        {result.inconvenience_label}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Affected passenger segments */}
                                            {result.affected_segments?.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="#ff80bf" fontWeight="bold">Passengers Most Likely to Affected</Typography>
                                                    <Stack spacing={0.5} mt={0.5}>
                                                        {result.affected_segments.map((seg, i) => (
                                                            <Typography key={i} variant="body1">
                                                                • {seg}
                                                            </Typography>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}

                                            {/* Optional: all impacts if any */}
                                            {result.all_impacts?.length > 0 && (
                                                <Box mt={1}>
                                                    <Typography variant="subtitle2">Other Impacts</Typography>
                                                    <Stack spacing={0.5} mt={0.5}>
                                                        {result.all_impacts.map((impact, i) => (
                                                            <Typography key={i} variant="body2" color="gray">
                                                                • {impact}
                                                            </Typography>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3 }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <AccessTimeIcon sx={{ color: "#7d38ff" }} />
                                                <Typography fontWeight="bold" fontSize="1.1rem">
                                                    Recommendations & Optimal Travel Times
                                                </Typography>
                                            </Box>

                                            {/* Recommendation Summary */}
                                            <Typography variant="subtitle2" mb={2} color="#7d38ff">
                                                {result.recommendation_summary}
                                            </Typography>

                                            {/* Best Options */}
                                            <Stack spacing={1} mb={2}>
                                                {result.best_departure_label && (
                                                    <Typography variant="body1" >
                                                        • Best Departure Hour: {result.best_departure_label}
                                                    </Typography>
                                                )}
                                                {result.best_day_of_week && (
                                                    <Typography variant="body1" >
                                                        • Best Day: {result.best_day_of_week}
                                                    </Typography>
                                                )}
                                                {result.best_airline && (
                                                    <Typography variant="body1">
                                                        • Best Airline: {result.best_airline}
                                                    </Typography>
                                                )}
                                            </Stack>

                                            {/* Time Slots Table */}
                                            {result.time_slots?.length > 0 && (
                                                <Box mt={1}>
                                                    <Typography variant="subtitle2" mb={1} fontWeight="bold">Time Slots & Delay Risk</Typography>
                                                    <Stack spacing={1}>
                                                        {result.time_slots.map((slot, i) => (
                                                            <Box
                                                                key={i}
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    bgcolor: "#222",
                                                                    p: 1,
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                <Typography variant="body1" color="white">{slot.label}</Typography>
                                                                <Typography variant="body1" color={slot.estimated_delay_risk > 0.5 ? "#ff4d4d" : "#00e6ac"}>
                                                                    {Math.round(slot.estimated_delay_risk * 100)}% risk — {slot.recommendation}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card sx={{ ...glassStyle, p: 3, minHeight: 275 }}>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <CompareArrowsIcon sx={{ color: "#ff6e40" }} />
                                                <Typography fontWeight="bold" fontSize="1.1rem">
                                                    Counterfactual Analysis
                                                </Typography>
                                            </Box>

                                            {/* Interpretation */}
                                            <Typography variant="subtitle2" color="#ff6e40" mb={2}>
                                                {result.counterfactual.interpretation}
                                            </Typography>

                                            {/* Baseline vs Counterfactual */}
                                            <Stack spacing={1} mb={2}>
                                                <Typography variant="body1">
                                                    • Baseline Delay Probability: {(result.counterfactual.baseline_delay_probability * 100).toFixed(1)}% ({result.counterfactual.baseline_class})
                                                </Typography>
                                                <Typography variant="body1" >
                                                    • Counterfactual Delay Probability: {(result.counterfactual.counterfactual_delay_probability * 100).toFixed(1)}% ({result.counterfactual.counterfactual_class})
                                                </Typography>
                                                <Typography variant="body1" color={result.counterfactual.risk_change_pct < 0 ? "#00e6ac" : "#ff4d4d"}>
                                                    • Risk Change: {result.counterfactual.risk_change_pct.toFixed(1)}%
                                                </Typography>
                                            </Stack>

                                            {/* Recommendation */}
                                            <Typography variant="body1" mb={1}>
                                                Recommendation: {result.counterfactual.recommendation}
                                            </Typography>

                                            {/* Changes Applied */}
                                            {/* <Box>
                                            <Typography variant="subtitle2" mb={0.5}>Changes Applied:</Typography>
                                            {Object.entries(result.counterfactual.changes_applied).map(([key, val], i) => (
                                                <Typography key={i} variant="body2" color="gray">
                                                    • {key.replace(/_/g, " ")}: {val.from} → {val.to}
                                                </Typography>
                                            ))}
                                        </Box> */}
                                        </Card>
                                    </Grid>
                                    {/* Travel Advisory */}
                                    {result.travel_insight_ && (
                                        <Grid size={{ xs: 12 }}>
                                            <Card sx={{ ...glassStyle, p: 3 }}>

                                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <TravelExploreIcon sx={{ color: "#ffaa00", fontSize: 24 }} />
                                                        <Typography fontSize="1.1rem" fontWeight="bold">
                                                            Travel Advisory
                                                        </Typography>
                                                    </Box>

                                                    <Chip
                                                        label={`${result.travel_insight_.risk_level} RISK`}
                                                        sx={{
                                                            bgcolor:
                                                                result.travel_insight_.risk_level === "HIGH"
                                                                    ? "#ff4d4d"
                                                                    : result.travel_insight_.risk_level === "MEDIUM"
                                                                        ? "#ffaa00"
                                                                        : "#4caf50",
                                                            color: "white",
                                                            fontWeight: "bold"
                                                        }}
                                                    />

                                                </Box>

                                                {/* Metadata Row */}

                                                <Box display="flex" gap={4} mb={2} flexWrap="wrap">

                                                    <Typography variant="body1" color="grey">
                                                        Destinaion Airport: <b>{result.travel_insight_.airport_code || "N/A"}</b>
                                                    </Typography>

                                                    <Typography variant="body1" color="grey">
                                                        Category: <b>{result.travel_insight_.risk_category}</b>
                                                    </Typography>

                                                    <Typography variant="body1" color="grey">
                                                        Generated Date:{" "}
                                                        <b>
                                                            {new Date(result.travel_insight_.generated_date).toLocaleDateString()}
                                                        </b>
                                                    </Typography>

                                                </Box>

                                                {/* Summary */}

                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: "#e7b800", mb: 2 }}
                                                >
                                                    {result.travel_insight_.short_summary}
                                                </Typography>

                                                {/* Traveler Advice */}

                                                <Box mt={2}>
                                                    <Typography fontWeight="bold" mb={1}>
                                                        Traveler Recommendations
                                                    </Typography>

                                                    {result.travel_insight_.traveler_advisories?.map((adv, i) => (
                                                        <Box key={i} display="flex" gap={1} mb={1}>
                                                            <Typography sx={{ color: "#ffaa00" }}>•</Typography>
                                                            <Typography variant="body1" >
                                                                {adv.text}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>

                                            </Card>
                                        </Grid>
                                    )}

                                </Grid>
                            </>
                        )}
                    </Box>
                </Card >
            </Box >
        </>
    );
};

export default FlightInputForm;
