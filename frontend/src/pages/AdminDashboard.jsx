import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    useTheme
} from "@mui/material";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";

import {
    getAdminDashboardStats,
    getAdminDashboard,
    getUserRoles,
    getLast10Predictions,
    getUpcomingHolidays,
    getUpcomingFlights
} from "../services/authService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const COLORS = ["rgb(0, 175, 152)", "rgb(63, 146, 172)", "#00c49fff", "#ffbb28ff"];
const now = new Date();
now.setDate(now.getDate() + 1);
const month = now.toLocaleString("default", { month: "long" });
const year = now.getFullYear();

const formattedTomorrow = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
});

const AdminDashboard = () => {
    const theme = useTheme();

    const [stats, setStats] = useState(null);
    const [roleStats, setRoleStats] = useState([]);
    const [last10Predictions, setLast10Predictions] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [flights, setFlights] = useState([]);
    const [delayDistribution, setDelayDistribution] = useState({
        labels: [],
        values: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch summary stats
                const statsRes = await getAdminDashboardStats();
                setStats(statsRes.data);

                // Fetch user roles and format for PieChart
                const rolesRes = await getUserRoles();
                const formattedRoles = rolesRes.data.labels.map((label, idx) => ({
                    role: label.charAt(0).toUpperCase() + label.slice(1),
                    count: rolesRes.data.values[idx] || 0
                }));
                setRoleStats(formattedRoles);

                // Fetch last 10 predictions
                const last10Res = await getLast10Predictions();
                setLast10Predictions(last10Res.data.predictions);

                // Fetch upcoming holidays
                const holidaysRes = await getUpcomingHolidays();
                setHolidays(holidaysRes.data.holidays);

                // Fetch upcoming holidays
                const flightsRes = await getUpcomingFlights();
                setFlights(flightsRes.data.flights);

                // Fetch delay distribution
                const delayDistRes = await getAdminDashboard();
                setDelayDistribution(delayDistRes.data);

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (!stats) return <div>Loading...</div>;

    const {
        predictions_this_month,
        total_users,
        average_probability,
        flights_this_month,
        high_risk_percentage,
    } = stats;

    // Prepare PieChart data for roles
    const rolePieData = roleStats;


    return (
        <Box p={3}>
            <Typography variant="h5" style={{
                border: "none",
                fontSize: "1.2rem",
                fontWeight: 'bold',
                color: theme.palette.text.main,
                marginBottom: "20px"
            }}>
                Admin Dashboard
            </Typography>

            {/* Summary Cards */}
            <Card sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                        <Card style={{
                            p: 3,
                            height: "100%",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                            <Typography style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}>Total Users</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{total_users}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                        <Card style={{
                            p: 3,
                            height: "100%",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                            <Typography style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}>Predictions on {month + " - " + year}</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{predictions_this_month}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                        <Card style={{
                            p: 3,
                            height: "100%",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                            <Typography style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}>Number of Flights on {month + " - " + year}</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{flights_this_month}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                        <Card style={{
                            p: 3,
                            height: "100%",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "center",
                        }}>
                            <Typography style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}>Average Departure Delay</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{(average_probability * 100).toFixed(2)}%</Typography>
                        </Card>
                    </Grid>

                </Grid>
            </Card>

            {/* User Roles PieChart */}
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" style={{
                                border: "none",
                                fontSize: "0.95rem",
                                fontWeight: 'bold',
                                color: theme.palette.text.main,
                                marginBottom: "20px"
                            }} >User Roles Distribution</Typography>
                            <Box sx={{ width: "100%", height: 300 }}>
                                <PieChart width="100%" height={300}>
                                    <Pie
                                        data={rolePieData}
                                        dataKey="count"
                                        nameKey="role"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {rolePieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Delay Distribution BarChart */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                    <Card>
                        <CardContent>
                            <Typography variant="h6" style={{
                                border: "none",
                                fontSize: "0.95rem",
                                fontWeight: 'bold',
                                color: theme.palette.text.main,
                                marginBottom: "20px"
                            }} >Predicted Delay Distribution on {month + " - " + year}</Typography>
                            {delayDistribution.labels.length > 0 ? (
                                <Card sx={{ marginLeft: 10 }}>
                                    <BarChart width={400} height={300} data={delayDistribution.labels.map((label, idx) => ({
                                        delay: label,
                                        count: delayDistribution.values[idx] || 0
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="delay" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="rgb(0, 151, 189)" />
                                    </BarChart>
                                </Card>
                            ) : (
                                <Typography>No data available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={4} marginTop={4}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} >
                    <Card sx={{ minHeight: 550, maxHeight: 620, overflow: "auto" }}>
                        <CardContent>
                            <Typography variant="h6" style={{
                                border: "none",
                                fontSize: "0.95rem",
                                fontWeight: 'bold',
                                color: theme.palette.text.main,
                                marginBottom: "20px"
                            }} >Upcoming Flights on {formattedTomorrow}</Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Origin</TableCell>
                                            <TableCell>Destiation</TableCell>
                                            <TableCell>Scheduled Departure</TableCell>
                                            <TableCell>Scheduled Arrival</TableCell>
                                            <TableCell>Airline</TableCell>
                                            <TableCell>Status</TableCell>
                                            {/* <TableCell>Aircraft</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {flights.map((p, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{p.departure_airport}</TableCell>
                                                <TableCell>{p.arrival_airport}</TableCell>
                                                <TableCell>{dayjs(p.scheduled_departure).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                <TableCell>{dayjs(p.scheduled_arrival).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                <TableCell>{p.airline}</TableCell>
                                                <TableCell>{p.status}</TableCell>
                                                {/* <TableCell>{p.aircraft}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }} container direction="column" spacing={4}>
                    <Grid >
                        <Card>
                            <CardContent>
                                <Typography variant="h6" style={{
                                    border: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 'bold',
                                    color: theme.palette.text.main,
                                    marginBottom: "20px"
                                }} >Last 10 Predictions</Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Route</TableCell>
                                                <TableCell>Probability</TableCell>
                                                <TableCell>Risk Level</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {last10Predictions.map((p, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{p.user_email}</TableCell>
                                                    <TableCell>{p.route}</TableCell>
                                                    <TableCell>{(p.probability * 100).toFixed(2)}%</TableCell>
                                                    <TableCell>{p.risk_level}</TableCell>
                                                    <TableCell> {dayjs.utc(p.created_at)     // treat input as UTC
                                                        .tz("Asia/Colombo")    // convert to Sri Lanka time
                                                        .format("YYYY-MM-DD HH:mm")}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid >
                        <Card>
                            <CardContent>
                                <Typography variant="h6" style={{
                                    border: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 'bold',
                                    color: theme.palette.text.main,
                                    marginBottom: "20px"
                                }} >Holidays on {month + " - " + year}</Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Type</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {holidays.map((h, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{h.name}</TableCell>
                                                    <TableCell>{new Date(h.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{h.type}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;