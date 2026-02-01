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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logo from './../assets/logo.png';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AuthContext } from "../context/AuthContext";
import { getTrendReport } from "../services/authService";
import { toast } from "react-toastify";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const TrendReport = () => {
    const [loading, setLoading] = useState(false);
    const printRef = useRef(null)
    const theme = useTheme();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [canPrint, setCanPrint] = useState(false);
    const [trend, setTrend] = useState([]);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    const handleApplyFilters = () => {
        if (!toDate || !fromDate) {
            toast.error("Please Enter Start Date and End Date");
            return;
        }

        fetchTrend();
        // setCanPrint(true);
    };


    const fetchTrend = async () => {
        try {
            const res = await getTrendReport(user.email, fromDate, toDate);
            setTrend(res.data.trend || []);
            setCanPrint(true);
        } catch (err) {
            console.error(err);
            setTrend([]);
            setCanPrint(false);
            toast.error(err.response?.data?.detail || "Failed to fetch trend");
        }
    };

    useEffect(() => {
        setCanPrint(false);
    }, [toDate, fromDate]);

    const handleResetFilters = () => {
        setFromDate("");
        setToDate("");
        setTrend([]);
        setCanPrint(false);
        setError("");
    };


    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const win = window.open('', '', 'width=900,height=650');
        win.document.write(`
      <html>
        <head>
          <title>Users Health Report</title>
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
                Individual Health & Risk Report
            </Typography>

            {/* Filters */}
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
                    {/* <TextField
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={fromDate}
                        sx={{
                            height: 30,
                            '& .MuiOutlinedInput-root': {
                                py: 0,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: "11px"
                            },
                        }}
                        onChange={(e) => setFromDate(e.target.value)}
                    /> */}
                    {/* <TextField
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={toDate}
                        sx={{
                            height: 30,
                            '& .MuiOutlinedInput-root': {
                                py: 0,
                                height: 30,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: "11px"
                            },
                        }}
                        onChange={(e) => setToDate(e.target.value)}
                    /> */}

                </Box>
                <Button sx={{ mt: 2 }} variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
                <Button
                    sx={{ mt: 2, ml: 2 }}
                    variant="outlined"
                    color="secondary"
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

            {/* Table */}
            <Box>
                {loading ? (
                    <div className="text-center mt-4">
                        <CSpinner size="sm" /> Loading...
                    </div>
                ) : (

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead >
                                <TableRow >
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>No</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Risk</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Probability (%)</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Prediction Date</TableCell>

                                    {/* Health */}
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Age</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Alcohol / Week</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Activity (min)</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Diet Score</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Sleep (hrs)</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Screen Time(hrs)</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>BMI</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Waist-Hip</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Sys BP</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Dia BP</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Heart Rate</TableCell>

                                    {/* Cholesterol */}
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Total Chol</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>HDL</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>LDL</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Triglycerides</TableCell>

                                    {/* Demographic */}
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Gender</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Ethnicity</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Education</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Income</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Smoking</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Employment</TableCell>

                                    {/* History */}
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Family Diabetes</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Hypertension</TableCell>
                                    <TableCell sx={{ fontSize: "10px", fontWeight: "bold", py: 0.1, textAlign: "center" }}>Cardio History</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trend.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{i + 1}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.risk_label}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.probability}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>
                                            {row.date}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.age}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.alcohol_consumption_per_week}</TableCell>


                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.physical_activity_minutes_per_week}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.diet_score}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.sleep_hours_per_day}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.screen_time_hours_per_day}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.bmi}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.waist_to_hip_ratio}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.systolic_bp}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.diastolic_bp}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.heart_rate}</TableCell>

                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.cholesterol_total}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.hdl_cholesterol}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.ldl_cholesterol}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.triglycerides}</TableCell>

                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.gender}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.ethnicity}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.education_level}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.income_level}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.smoking_status}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.employment_status}</TableCell>

                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.family_history_diabetes === 1 ? "Yes" : "No"}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.hypertension_history === 1 ? "Yes" : "No"}</TableCell>
                                        <TableCell sx={{ fontSize: "9px", py: 0.6, textAlign: "center" }}>{row.features.cardiovascular_history === 1 ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))}
                                {trend.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                                            No user data found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <div
                ref={printRef}
                style={{
                    display: "none",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "9px",
                    color: "#000",
                    width: "100%",
                    padding: "10px",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: 50, height: 50, verticalAlign: "middle", marginRight: 8 }}
                    />
                    <h1 style={{ display: "inline-block", margin: 0, fontWeight: "bold", fontSize: "15px" }}>
                        DiaPredict
                    </h1>
                </div>
                <p style={{ textAlign: "center", marginTop: 0, marginBottom: 2, fontSize: "11px" }}>
                    No. 000, Main Street, Colombo
                </p>
                <p style={{ textAlign: "center", marginTop: 0, marginBottom: 4, fontSize: "11px" }}>
                    011-2233445 / 011-5566778
                </p>
                <hr style={{ borderTop: "1px solid #000", marginBottom: 4 }} />

                {/* Report Info */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: "9px",
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: "12px" }}>
                            <strong>Individual Helath & Risk Report</strong>
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

                {/* Full Table */}
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            // width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "7px",
                            // tableLayout: "fixed",
                        }}
                        border="1"
                    >
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Risk</th>
                                <th>Probability (%)</th>
                                <th>Prediction Date</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Ethnicity</th>
                                <th>Education</th>
                                <th>Income</th>
                                <th>Employment</th>
                                <th>Smoking</th>
                                <th>Alcohol / Week</th>
                                <th>Activity (mi/week)</th>
                                <th>Diet Score</th>
                                <th>Sleep (hrs/day)</th>
                                <th>Screen Time (hrs/day)</th>
                                <th>BMI</th>
                                <th>Waist-Hip Ratio</th>
                                <th>Sys BP</th>
                                <th>Dia BP</th>
                                <th>Heart Rate</th>
                                <th>Total Chol</th>
                                <th>HDL</th>
                                <th>LDL</th>
                                <th>Triglycerides</th>
                                <th>Family Diabetes</th>
                                <th>Hypertension</th>
                                <th>Cardio History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trend.length > 0 ? (
                                trend.map((t, index) => {
                                    const f = t.features || {};
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{t.risk_label}</td>
                                            <td>{t.probability}</td>
                                            <td>
                                                {t.date}
                                            </td>
                                            <td>{f.age ?? "-"}</td>
                                            <td>{f.gender ?? "-"}</td>
                                            <td>{f.ethnicity ?? "-"}</td>
                                            <td>{f.education_level ?? "-"}</td>
                                            <td>{f.income_level ?? "-"}</td>
                                            <td>{f.employment_status ?? "-"}</td>
                                            <td>{f.smoking_status ?? "-"}</td>
                                            <td>{f.alcohol_consumption_per_week ?? "-"}</td>
                                            <td>{f.physical_activity_minutes_per_week ?? "-"}</td>
                                            <td>{f.diet_score ?? "-"}</td>
                                            <td>{f.sleep_hours_per_day ?? "-"}</td>
                                            <td>{f.screen_time_hours_per_day ?? "-"}</td>
                                            <td>{f.bmi ?? "-"}</td>
                                            <td>{f.waist_to_hip_ratio ?? "-"}</td>
                                            <td>{f.systolic_bp ?? "-"}</td>
                                            <td>{f.diastolic_bp ?? "-"}</td>
                                            <td>{f.heart_rate ?? "-"}</td>
                                            <td>{f.cholesterol_total ?? "-"}</td>
                                            <td>{f.hdl_cholesterol ?? "-"}</td>
                                            <td>{f.ldl_cholesterol ?? "-"}</td>
                                            <td>{f.triglycerides ?? "-"}</td>
                                            <td>{f.family_history_diabetes ? "Yes" : "No"}</td>
                                            <td>{f.hypertension_history ? "Yes" : "No"}</td>
                                            <td>{f.cardiovascular_history ? "Yes" : "No"}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="29" style={{ textAlign: "center" }}>
                                        No Risk Records Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <footer
                    style={{
                        marginTop: 8,
                        width: "100%",
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        borderTop: "1px solid #ccc",
                        padding: "5px 0",
                    }}
                >
                    <p style={{ margin: 0 }}>
                        DiaPredict – Empowering Health Insights and Diabetes Risk Awareness
                    </p>
                    <p style={{ margin: 0, fontSize: "8px", color: "#555" }}>
                        © {new Date().getFullYear()} DiaPredict. All rights reserved.
                    </p>
                </footer>

            </div>
        </Box >
    );
};

export default TrendReport;
