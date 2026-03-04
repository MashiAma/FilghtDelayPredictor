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
    CircularProgress
} from "@mui/material";
import logo from "../../assets/images/logo.png";
import { AuthContext } from "../../context/AuthContext";
import { getAdminPredictionReport } from "../../services/authService";
import { toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";


const AdminPredictionReport = () => {
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(false);
    const printRef = useRef(null);
    const [date, setDate] = useState(dayjs)
    const theme = useTheme();
    const DEFAULT_FILTERS = {
        airline: "",
        aircraft: "",
        destination: "",
        from_date: "",
        to_date: "",
    };
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [canPrint, setCanPrint] = useState(false);

    const handleApplyFilters = () => {
        if (!filters.to_date || !filters.from_date) {
            toast.error("Please Enter Start Date and End Date");
            return;
        }

        fetchData();
        setCanPrint(true);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAdminPredictionReport(filters);
            setTrend(res.data.predictions || []);
        } catch (err) {
            setLoading(false);
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to fetch trend");
        }
    };

    useEffect(() => {
        setCanPrint(false);
    }, [filters]);

    const arrival_options = ['BOM', 'DEL', 'BLR', 'MAA', 'HYD', 'KHI', 'LHE', 'DAC', 'KTM', 'MLE'];
    const airlines_options = ['SriLankan Airlines', 'Air India', 'IndiGo', 'Emirates', 'fitsAir', 'flydubai', 'Gulf Air'];
    const aircrafts_options = ["A20N", "A21N", "A320", "A321", "A332", "A333", "B38M", "B39M", "B738", "B77W"]

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const win = window.open('', '', 'width=900,height=650');
        win.document.write(`
      <html>
        <head>
          <title>All Flights Delay Prediction Report Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; height: 260px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h2, h3 { margin: 0; padding: 5px 0; }
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
                fontSize: "1.1rem",
                fontWeight: 'bold',
                color: theme.palette.text.main,
                marginBottom: "20px"
            }}>
                All Flights Delay Prediction Report
            </Typography>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginBottom: "25px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={filters.from_date ? dayjs(filters.from_date) : null}
                            onChange={(newValue) => {
                                setFilters({
                                    ...filters,
                                    from_date: newValue ? newValue.format("YYYY-MM-DD") : "",
                                });
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
                            value={filters.to_date ? dayjs(filters.to_date) : null}
                            onChange={(newValue) => {
                                setFilters({
                                    ...filters,
                                    to_date: newValue ? newValue.format("YYYY-MM-DD") : "",
                                });
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
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: "15px" }}>
                    <Select
                        value={filters.airline}
                        onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
                        displayEmpty
                        sx={{
                            height: 30,
                            '& .MuiOutlinedInput-input': {
                                py: 0,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: "11px"
                            },
                        }}
                    >
                        <MenuItem value="" sx={{ minHeight: 30, py: 0.5 }}>Select Airline</MenuItem>
                        {airlines_options.map((g) => (
                            <MenuItem key={g} value={g} sx={{ minHeight: 30, py: 0.5 }}>{g}</MenuItem>
                        ))}
                    </Select>


                    <Select
                        value={filters.destination}
                        onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                        displayEmpty
                        sx={{
                            height: 30,
                            '& .MuiOutlinedInput-input': {
                                py: 0,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: "11px"
                            },
                        }}
                    >
                        <MenuItem value="" sx={{ minHeight: 30, py: 0.5 }}>Select Destination</MenuItem>
                        {arrival_options.map((e) => (
                            <MenuItem key={e} value={e} sx={{ minHeight: 30, py: 0.5 }}>{e}</MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={filters.aircraft}
                        onChange={(e) =>
                            setFilters({ ...filters, aircraft: e.target.value })
                        }
                        displayEmpty
                        sx={{
                            height: 30,
                            '& .MuiOutlinedInput-input': {
                                py: 0,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: "11px"
                            },
                        }}
                    >
                        <MenuItem value="" sx={{ minHeight: 30, py: 0.5 }}>Select Aircraft</MenuItem>
                        {aircrafts_options.map((e) => (
                            <MenuItem key={e} value={e} sx={{ minHeight: 30, py: 0.5 }}>{e}</MenuItem>
                        ))}
                    </Select>
                </Box>


                <Button sx={{ mt: 2 }} variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
                <Button
                    sx={{ mt: 2, ml: 2 }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        setFilters(DEFAULT_FILTERS);
                        // getAdminPredictionReport({}).then((res) => {
                        //     setTrend(res.data.predictions || []);
                        // });
                    }}
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
            </Paper>

            {/* Table */}
            <Box>
                {/* {loading ? (
                    <div className="text-center mt-4">
                        <CircularProgress size="sm" /> Loading...
                    </div>
                ) : ( */}

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead >
                            <TableRow >
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>No</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>User Email</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Airline</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Aircraft</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Origin</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Destination</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Scheduled Departure</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Scheduled Arrival</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Depature Delay Class</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Depature Probability</TableCell>
                                <TableCell sx={{ fontSize: "12px", fontWeight: "bold", py: 1.5, textAlign: "center" }}>Prediction Date</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {trend.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{i + 1}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.user_email}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.airline || "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.aircraft || "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.origin || "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.destination || "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.scheduled_departure ? dayjs(row.flight.scheduled_departure).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.flight.scheduled_arrival ? dayjs(row.flight.scheduled_arrival).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.delay_class_dep || "-"}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{row.dep_probability?.toFixed ? (row.dep_probability * 100).toFixed(2) + "%" : "-"}</TableCell>                                   <TableCell sx={{ fontSize: "11px", py: 1.0, textAlign: "center" }}>{dayjs(row.created_at).format("YYYY-MM-DD HH:mm")}</TableCell>
                                </TableRow>
                            ))}
                            {trend.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={13} style={{ textAlign: "center" }}>
                                        No flight predictions found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* )} */}
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
                        fontSize: "10px",
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: "16px" }}>
                            All Flights Delay Prediction Report
                        </h2>
                    </div>
                    <div>
                        From: <strong>{filters.from_date || "All"}</strong> to{" "}
                        <strong>{filters.to_date || "All"}</strong>
                    </div>
                    <div>
                        <strong>Date:</strong> {new Date().toLocaleDateString()}{" "}
                        {new Date().toLocaleTimeString()}
                    </div>
                </div>
                <hr style={{ borderTop: "1px solid #000", marginBottom: 4 }} />
                <div style={{ overflowX: "auto" }}>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", }}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th style={{ minWidth: "70px" }}>User Email</th>
                                <th>Airline</th>
                                <th>Aircraft</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Scheduled Departure</th>
                                <th>Scheduled Arrival</th>
                                <th>Depature Delay Class</th>
                                <th>Depature Probability</th>
                                <th>Prediction Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trend.length > 0 ? (
                                trend.map((row, i) => {
                                    const flight = row.flight || {};
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td style={{ minWidth: "70px" }}>{row.user_email}</td>
                                            <td>{flight.airline || "-"}</td>
                                            <td>{flight.aircraft || "-"}</td>
                                            <td>{flight.origin || "-"}</td>
                                            <td>{flight.destination || "-"}</td>
                                            <td>{flight.scheduled_departure ? dayjs(flight.scheduled_departure).format("YYYY-MM-DD HH:mm") : "-"}</td>
                                            <td>{flight.scheduled_arrival ? dayjs(flight.scheduled_arrival).format("YYYY-MM-DD HH:mm") : "-"}</td>
                                            <td>{row.delay_class_dep || "-"}</td>
                                            <td>{row.dep_probability?.toFixed ? (row.dep_probability * 100).toFixed(2) + "%" : "-"}</td>
                                            <td>{dayjs(row.created_at).format("YYYY-MM-DD HH:mm")}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={13} style={{ textAlign: "center" }}>No flight predictions found</td>
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
        </Box>
    );
};

export default AdminPredictionReport;
