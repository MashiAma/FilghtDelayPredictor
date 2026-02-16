import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    useTheme,
    Collapse,
    IconButton,
} from "@mui/material";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { getAdminDashboardStats } from "../services/authService";

const COLORS = ["#00685aff", "#003775ff", "#0086afff"]; // Low, High

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAdminDashboardStats();
                setStats(res.data); // assuming axios-style response
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (!stats) return <div>Loading...</div>;

    const { total_flights_current_month, total_predictions_current_month, total_users, average_departure_delay, delay_rate_percent, most_delayed_airline } = stats;

    // Top high-risk users
    // const topHighRisk = [...users]
    //     .sort((a, b) => b.probability - a.probability)
    //     .slice(0, 10);

    // Pie chart data
    // const pieData = [
    //     { name: "Low Risk", value: risk_distribution.low },
    //     { name: "High Risk", value: risk_distribution.high },
    //     { name: "Not Checked", value: risk_distribution.not_checked }
    // ];

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
                            }}>Total Flights</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{total_flights_current_month}</Typography>
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
                            }}>Total Predictions</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{total_predictions_current_month}</Typography>
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
                            }}>Average Depature Delay</Typography>
                            <Typography style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                mb: 1,
                                color: theme.palette.text.main,
                            }}>{average_departure_delay}</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
            {/* <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" style={{
                                border: "none",
                                fontSize: "0.95rem",
                                fontWeight: 'bold',
                                color: theme.palette.text.main,
                                marginBottom: "20px"
                            }} >Risk Distribution</Typography>
                            <Box sx={{ width: "100%", height: 300 }}>
                                <PieChart width="100%" height={300}>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label
                                    >
                                        {pieData.map((entry, index) => (
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
                <Grid size={{ xs: 12, sm: 6, md: 8 }} >
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" style={{
                                border: "none",
                                fontSize: "0.95rem",
                                fontWeight: 'bold',
                                color: theme.palette.text.main,
                                marginBottom: "20px"
                            }} >Last Predicted User List</Typography>
                            <Box sx={{ width: "100%", height: 300, }}>
                                <BarChart data={topHighRisk} width="100%" height={300}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="email" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="probability" fill="#004d91ff" />
                                </BarChart>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ marginTop: "25px" }}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Typography style={{
                            border: "none",
                            fontSize: "0.95rem",
                            fontWeight: 'bold',
                            color: theme.palette.text.main,
                            marginBottom: "5px"
                        }} >Top 10 High-Risk Users Summary</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 0.1, textAlign: "left" }}>Email</TableCell>
                                        <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 0.1, textAlign: "left" }}>Probability</TableCell>
                                        <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 0.1, textAlign: "left" }}>Risk Label</TableCell>
                                        <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 0.1, textAlign: "left" }}>Prediction Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users
                                        .filter(u => u.probability >= 50)
                                        .map(u => (
                                            <TableRow key={u.email}>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{u.probability}</TableCell>
                                                <TableCell>{u.label}</TableCell>
                                                <TableCell>{u.created_at}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </CardContent>
                </Card>
            </Grid> */}
        </Box >

    );
};

export default AdminDashboard;