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
    Button
} from '@mui/material';
import { toast } from 'react-toastify';
import { getAllHolidays, updateHoliday } from '../../../services/authService';
import HolidayDialog from './HolidayDialog';

/* ---------- Helpers ---------- */
const isTodayOrFuture = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);

    return d >= today;
};
/* ----------------------------- */

const ViewHolidays = () => {
    const [holidaysByType, setHolidaysByType] = useState({});
    const [types, setTypes] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const rowsPerPage = 6;

    /* ---------- Fetch Holidays ---------- */
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await getAllHolidays();
                const all = res.data;

                // Only today & future holidays
                const upcoming = all.filter(h =>
                    isTodayOrFuture(h.holiday_date)
                );

                // Group by holiday_type
                const grouped = {};
                upcoming.forEach(h => {
                    const type = h.holiday_type || 'Other';
                    if (!grouped[type]) grouped[type] = [];
                    grouped[type].push(h);
                });

                setHolidaysByType(grouped);
                setTypes(Object.keys(grouped));
            } catch {
                toast.error('Failed to load holidays');
            }
        };

        fetchHolidays();
    }, []);

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
            h.holiday_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Box p={2}>
            <Typography variant="h5" mb={2}>
                Holidays (Today & Upcoming)
            </Typography>

            <TextField
                fullWidth
                placeholder="Search holiday name..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                sx={{ mb: 2 }}
            />

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
                            <TableCell>Date</TableCell>
                            <TableCell>Holiday Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.length ? (
                            paginated.map(h => (
                                <TableRow key={h.id}>
                                    <TableCell>{h.holiday_date}</TableCell>
                                    <TableCell>{h.holiday_name}</TableCell>
                                    <TableCell>{h.holiday_type}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ backgroundColor: '#02187d' }}
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
    );
};

export default ViewHolidays;
