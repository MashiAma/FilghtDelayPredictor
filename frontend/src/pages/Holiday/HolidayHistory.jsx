import React, { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Pagination,
    Typography,
    Button,
    useTheme
} from '@mui/material';
import { toast } from 'react-toastify';
import { getAllHolidays, updateHoliday } from '../../services/authService'
import HolidayDialog from './View/HolidayDialog';

const today = new Date()

const lastYear = new Date(today)
lastYear.setFullYear(today.getFullYear() - 1)


const formatDateInput = (date) =>
    date.toISOString().split('T')[0]

const toDateObj = (dateTimeStr) =>
    new Date(dateTimeStr.replace(' ', 'T'))

const formatDateTime = (dateTimeStr) =>
    toDateObj(dateTimeStr).toLocaleString()

const isPast = (dateTimeStr) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const date = toDateObj(dateTimeStr)
    date.setHours(0, 0, 0, 0)

    return date <= today
}
/* ---------------------------------- */

const HolidayHistory = () => {
    const [holidaysByType, setHolidaysByType] = useState({});
    const [types, setTypes] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState(formatDateInput(lastYear))
    const [endDate, setEndDate] = useState(formatDateInput(today))
    const theme = useTheme();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const rowsPerPage = 10;

    /* ---------- Fetch Holidays ---------- */
    const isWithinDateRange = (dateTimeStr) => {
        const date = toDateObj(dateTimeStr)

        const from = new Date(fromDate)
        const to = new Date(endDate)

        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)

        return date >= from && date <= to
    }
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await getAllHolidays();
                const all = res.data;

                // Only today & future holidays
                const filteredHolidays = all.filter(h =>
                    isPast(h.holiday_date) &&
                    isWithinDateRange(h.holiday_date)
                );

                // Group by holiday_type
                const grouped = {};
                filteredHolidays.forEach(h => {
                    const type = h.holiday_type || 'Other';
                    if (!grouped[type]) grouped[type] = [];
                    grouped[type].push(h);
                });

                setHolidaysByType(grouped);
                setTypes(Object.keys(grouped));
                setCurrentPage(1)
            } catch {
                toast.error('Failed to load holidays');
            }
        };

        fetchHolidays();
    }, [fromDate, endDate])

    /* ---------- Handlers ---------- */
    const handleTabChange = (_, value) => {
        setActiveTab(value);
        setCurrentPage(1);
    };

    const handleView = (holiday) => {
        setSelectedHoliday(holiday);
        setDialogOpen(true);
    };

    const handleSave = async (updatedHoliday) => {
        try {
            await updateHoliday(updatedHoliday.id, updatedHoliday);

            setHolidaysByType(prev => {
                const copy = { ...prev };
                Object.keys(copy).forEach(type => {
                    copy[type] = copy[type].map(h =>
                        h.id === updatedHoliday.id ? updatedHoliday : h
                    );
                });
                return copy;
            });

            toast.success('Holiday updated');
            setDialogOpen(false);
        } catch {
            toast.error('Update failed');
        }
    };

    const filterHolidays = (holidays) =>
        holidays.filter(h =>
            h.holiday_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.holiday_type.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const paginate = (holidays) => {
        const start = (currentPage - 1) * rowsPerPage;
        return holidays.slice(start, start + rowsPerPage);
    };

    const currentType = types[activeTab];
    const currentHolidays = currentType
        ? holidaysByType[currentType] || []
        : [];

    const filtered = filterHolidays(currentHolidays);
    const paginated = paginate(filtered);

    /* ---------- UI ---------- */
    return (
        <>
            <Box p={3}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                >
                    <Typography variant="h5" style={{
                        border: "none",
                        fontSize: "1.2rem",
                        fontWeight: 'bold',
                        color: theme.palette.text.main,
                    }}>
                        Past Holidays Details
                    </Typography>
                    <Box display="flex" gap={2}>
                        <TextField
                            type="date"
                            size="small"
                            label="From"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: "200px" }}
                        />

                        <TextField
                            type="date"
                            size="small"
                            label="To"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: "200px" }}
                        />


                        <TextField
                            size="small"
                            placeholder="Search holiday name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            sx={{
                                minWidth: 400,
                                "& input": {
                                    fontSize: "0.75rem",
                                    color: theme.palette.text.primary,
                                    height: "15px"
                                },
                                "& input::placeholder": {
                                    color: "#a3a3a3ff",
                                    opacity: 1,
                                },
                                "& fieldset": {
                                    border: "1px solid #0e4a99",
                                },
                                backgroundColor: theme.palette.background.default,
                            }}
                        />
                    </Box>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {types.map(type => (
                        <Tab key={type} label={type} />
                    ))}
                </Tabs>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Holiday Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginated.length ? (
                                paginated.map(h => (
                                    <TableRow key={h.id}>
                                        <TableCell sx={{ py: 0.5 }}>{h.holiday_date}</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>{h.holiday_name}</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>{h.holiday_type}</TableCell>
                                        <TableCell align="right" sx={{ py: 0.5 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ backgroundColor: "rgba(0, 60, 100, 0.96)" }}
                                                onClick={() => handleView(h)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No holidays found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filtered.length > rowsPerPage && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={Math.ceil(filtered.length / rowsPerPage)}
                            page={currentPage}
                            onChange={(_, p) => setCurrentPage(p)}
                        />
                    </Box>
                )}

                {/* ---------- Dialog ---------- */}
                {selectedHoliday && (
                    <HolidayDialog
                        open={dialogOpen}
                        holiday={selectedHoliday}
                        onClose={() => setDialogOpen(false)}
                        onSave={handleSave}
                    />
                )}
            </Box>
        </>
    );
};

export default HolidayHistory;
