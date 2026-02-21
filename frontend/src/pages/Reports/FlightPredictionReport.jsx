import React, { useEffect, useState, useContext, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Collapse,
    IconButton,
    useTheme,
    CircularProgress,
    Grid
} from "@mui/material";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import { getUserPredictionReport } from "../../services/authService";
import { toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const FlightPredictionReport = () => {
    const [loading, setLoading] = useState(false);
    const printRef = useRef(null)
    const theme = useTheme();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [canPrint, setCanPrint] = useState(false);
    const [trend, setTrend] = useState([]);
    const { user } = useContext(AuthContext);
    const [reportData, setReportData] = useState({
        total_predictions: 0,
        on_time_count: 0,
        minor_count: 0,
        major_count: 0,
        predictions: []
    });

    const handleApplyFilters = () => {
        if (!toDate || !fromDate) {
            toast.error("Please Enter Start Date and End Date");
            return;
        }

        fetchTrend();
        // setCanPrint(true);
    };

    const fetchTrend = async () => {
        setLoading(true);
        try {
            const res = await getUserPredictionReport(user.email, fromDate, toDate);
            setTrend(res.data.predictions || []);
            setReportData(res.data || {
                total_predictions: 0,
                on_time_count: 0,
                minor_count: 0,
                major_count: 0,
                predictions: []
            });
            setCanPrint(true);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to fetch report");
            setTrend([]);
            setReportData({
                total_predictions: 0,
                on_time_count: 0,
                minor_count: 0,
                major_count: 0,
                predictions: []
            });
            setCanPrint(false);
        }
    };

    useEffect(() => {
        setCanPrint(false);
    }, [toDate, fromDate]);

    const handleResetFilters = () => {
        setFromDate("");
        setToDate("");
        setTrend([]);
        setReportData({
            total_predictions: 0,
            on_time_count: 0,
            minor_count: 0,
            major_count: 0,
            predictions: []
        });
        setCanPrint(false);
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const win = window.open('', '', 'width=900,height=650');
        win.document.write(`
            <html>
                <head>
                    <title>Flight Prediction Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #000; padding: 4px; font-size: 10px; text-align: center; }
                        h2, h3 { margin: 0; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
        win.onafterprint = () => win.close();
    };

    return (
        <Box p={3}>
            <Typography variant="h5" style={{
                border: "none",
                fontSize: "1.2rem",
                fontWeight: 'bold',
                marginBottom: "20px",
                color: theme.palette.text.main,
            }}>
                Flight Delay Predictions Report
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={fromDate ? dayjs(fromDate) : null}
                            onChange={(newValue) => {
                                setFromDate(newValue ? newValue.format("YYYY-MM-DD") : "");
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: {
                                        height: 30,
                                        '& .MuiOutlinedInput-root': {
                                            height: 30,
                                            fontSize: "11px",
                                        },
                                    },
                                },
                                openPickerButton: {
                                    sx: {
                                        '& svg': { fontSize: 16 }, // shrink the calendar icon
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date"
                            value={toDate ? dayjs(toDate) : null}
                            onChange={(newValue) => {
                                setToDate(newValue ? newValue.format("YYYY-MM-DD") : "");
                            }}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: {
                                        height: 30,
                                        '& .MuiOutlinedInput-root': {
                                            height: 30,
                                            fontSize: "11px",
                                        },
                                    },
                                },
                                openPickerButton: {
                                    sx: {
                                        '& svg': { fontSize: 16 }, // shrink the calendar icon
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>

                </Box>
                <Button sx={{ mt: 2 }} variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
                <Button
                    sx={{ mt: 2, ml: 2 }}
                    variant="outlined"
                    color="primary"
                    onClick={handleResetFilters}
                >
                    Reset Filters
                </Button>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        onClick={handlePrint}
                        disabled={!canPrint}
                    >
                        Print Report
                    </Button>
                </Box>
            </Paper >
            <Box>
                <Box>
                    {/* <Paper sx={{ p: 2, mb: 4 }}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                                Total Prediction Count -{" "}
                                <span style={{ color: "#1976d2" }}>
                                    {reportData.total_predictions}
                                </span>
                            </Typography>

                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                                On-time Count -{" "}
                                <span style={{ color: "green" }}>
                                    {reportData.on_time_count}
                                </span>
                            </Typography>

                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                                Minor Delay Count -{" "}
                                <span style={{ color: "orange" }}>
                                    {reportData.minor_count}
                                </span>
                            </Typography>

                            <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                                Major Delay Count -{" "}
                                <span style={{ color: "red" }}>
                                    {reportData.major_count}
                                </span>
                            </Typography>
                        </Box>
                    </Paper> */}
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>No</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Airline</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Origin</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Destination</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Scheduled Departure</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Scheduled Arrival</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Depature Delay Class</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Depature Probability</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Arrival Delay Class</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Arrival Probability</TableCell>
                                    <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Prediction Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trend.length > 0 ? trend.map((row, i) => {
                                    const flight = row.flight || {};
                                    return (
                                        <TableRow key={i}>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{i + 1}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{flight.airline || "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{flight.origin || "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{flight.destination || "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{flight.scheduled_departure ? dayjs(flight.scheduled_departure).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{flight.scheduled_arrival ? dayjs(flight.scheduled_arrival).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.delay_class_dep || "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{(row.dep_probability * 100).toFixed(2) + "%" ?? "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.delay_class_arr || "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{(row.arr_probability * 100).toFixed(2) + "%" ?? "-"}</TableCell>
                                            <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{dayjs(row.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={11} style={{ textAlign: "center" }}>
                                            No flight predictions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <div ref={printRef} style={{
                display: "none",
                fontFamily: "Arial, sans-serif",
                fontSize: "9px",
                color: "#000",
                width: "100%",
                padding: "10px",
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: 50, height: 50, verticalAlign: "middle", marginRight: 8 }}
                    />
                    <h1 style={{ display: "inline-block", margin: 0, fontWeight: "bold", fontSize: "28px" }}>
                        SkyGuard
                    </h1>
                </div>
                <hr style={{ borderTop: "1px solid #000", marginBottom: 4 }} />
                {/* Report Info */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: "12px",
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: "16px" }}>
                            Flight Delay Prediction Report
                        </h2>
                    </div>
                    <div>
                        From: <strong>{fromDate || "All"}</strong> to{" "}
                        <strong>{toDate || "All"}</strong>
                    </div>
                    <div>
                        <strong>Date:</strong> {new Date().toLocaleDateString()}{" "}
                        {new Date().toLocaleTimeString()}
                    </div>
                </div>
                <hr style={{ borderTop: "1px solid #000", marginBottom: 4 }} />
                <div style={{ overflowX: "auto" }}>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Airline</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Scheduled Departure</th>
                                <th>Scheduled Arrival</th>
                                <th>Depature Delay Class</th>
                                <th>Depature Probability</th>
                                <th>Arrival Delay Class</th>
                                <th>Arrival Probability</th>
                                <th>Prediction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trend.length > 0 ? trend.map((row, i) => {
                                const flight = row.flight || {};
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{flight.airline || "-"}</td>
                                        <td>{flight.origin || "-"}</td>
                                        <td>{flight.destination || "-"}</td>
                                        <td>{flight.scheduled_departure ? dayjs(flight.scheduled_departure).format("YYYY-MM-DD HH:mm") : "-"}</td>
                                        <td>{flight.scheduled_arrival ? dayjs(flight.scheduled_arrival).format("YYYY-MM-DD HH:mm") : "-"}</td>
                                        <td>{row.delay_class_dep || "-"}</td>
                                        <td>{(row.dep_probability * 100).toFixed(2) + "%" ?? "-"}</td>
                                        <td>{row.delay_class_arr || "-"}</td>
                                        <td>{(row.arr_probability * 100).toFixed(2) + "%" ?? "-"}</td>
                                        <td>{dayjs(row.created_at).format("YYYY-MM-DD HH:mm")}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: "center" }}>No flight predictions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Footer */}
                <footer
                    style={{
                        marginTop: 25,
                        width: "100%",
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        borderTop: "1px solid #ccc",
                        padding: "5px 0",
                    }}
                >
                    <p style={{ margin: 0, marginBottom: 6 }}>
                        SkyGuard – Empowering Flight Insights and Delay Risk Awareness
                    </p>
                    <p style={{ margin: 0, fontSize: "8px", color: "#555" }}>
                        © {new Date().getFullYear()} SkyGuard. All rights reserved.
                    </p>
                </footer>

            </div>
        </Box >
    );
};

export default FlightPredictionReport;
