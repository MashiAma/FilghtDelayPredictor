import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import { toast } from 'react-toastify'
import { getAllFlights, updateFlight } from '../../services/authService'
import FlightDialog from './View/FlightDialog'


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

    return date < today
}
/* ---------------------------------- */

const FlightHistory = () => {
    const theme = useTheme()

    const [flightsByAirport, setFlightsByAirport] = useState({})
    const [airports, setAirports] = useState([])
    const [activeTab, setActiveTab] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [fromDate, setFromDate] = useState(formatDateInput(lastYear))
    const [endDate, setEndDate] = useState(formatDateInput(today))

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedFlight, setSelectedFlight] = useState(null)

    const rowsPerPage = 10

    /* ---------- Date Range Filter ---------- */
    const isWithinDateRange = (dateTimeStr) => {
        const date = toDateObj(dateTimeStr)

        const from = new Date(fromDate)
        const to = new Date(endDate)

        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)

        return date >= from && date <= to
    }
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await getAllFlights()
                const allFlights = response.data

                const filteredFlights = allFlights.filter(f =>
                    isPast(f.scheduled_departure) &&
                    isWithinDateRange(f.scheduled_departure)
                )

                const grouped = {}

                filteredFlights.forEach(flight => {
                    const airport = flight.arrival_airport
                    if (!grouped[airport]) grouped[airport] = []
                    grouped[airport].push(flight)
                })

                setFlightsByAirport(grouped)
                setAirports(Object.keys(grouped))
                setCurrentPage(1)
            } catch {
                toast.error('Failed to fetch flights')
            }
        }

        fetchFlights()
    }, [fromDate, endDate])
    /* ----------------------------------- */

    const handleTabChange = (_, value) => {
        setActiveTab(value)
        setCurrentPage(1)
    }

    const handleView = (flight) => {
        setSelectedFlight(flight)
        setDialogOpen(true)
    }

    const handleSave = async (updatedFlight) => {
        try {
            await updateFlight(updatedFlight.id, updatedFlight)

            setFlightsByAirport(prev => {
                const updated = { ...prev }

                Object.keys(updated).forEach(airport => {
                    updated[airport] = updated[airport].map(f =>
                        f.id === updatedFlight.id ? updatedFlight : f
                    )
                })

                return updated
            })

            toast.success("Flight updated successfully")
            setDialogOpen(false)
        } catch {
            toast.error("Failed to update flight")
        }
    }

    const filterFlights = (flights) =>
        flights.filter(f =>
            f.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.departure_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.airline.toLowerCase().includes(searchTerm.toLowerCase())
        )

    const paginate = (flights) => {
        const start = (currentPage - 1) * rowsPerPage
        return flights.slice(start, start + rowsPerPage)
    }

    const currentAirport = airports[activeTab]
    const currentFlights = currentAirport
        ? flightsByAirport[currentAirport] || []
        : []

    const filtered = filterFlights(currentFlights)
    const paginated = paginate(filtered)

    return (
        <Box p={3}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                gap={2}
            >
                <Typography variant="h5" style={{
                    border: "none",
                    fontSize: "1.2rem",
                    fontWeight: 'bold',
                    color: theme.palette.text.main,
                }}>
                    Past Flight Details
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
                        placeholder="Search by airline..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        sx={{ minWidth: 300 }}
                    />
                </Box>
            </Box>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                {airports.map((airport) => (
                    <Tab key={airport} label={airport} />
                ))}
            </Tabs>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontSize: "13px", fontWeight: "bold", py: 0.5, textAlign: "left" }}>Flight No</TableCell>
                            <TableCell sx={{ fontSize: "13px", fontWeight: "bold", py: 0.5, textAlign: "center" }}>Scheduled Departure</TableCell>
                            <TableCell sx={{ fontSize: "13px", fontWeight: "bold", py: 0.5, textAlign: "center" }}>Scheduled Arrival</TableCell>
                            <TableCell sx={{ fontSize: "13px", fontWeight: "bold", py: 0.5, textAlign: "center" }}>Airline</TableCell>
                            <TableCell align="right" sx={{ fontSize: "13px", fontWeight: "bold", py: 0.5, textAlign: "center" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.length > 0 ? (
                            paginated.map((f) => (
                                <TableRow key={f.id}>
                                    <TableCell sx={{ fontSize: "11px", py: 0.3, textAlign: "left" }}>{f.flight_number}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 0.3, textAlign: "center" }}>{formatDateTime(f.scheduled_departure)}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 0.3, textAlign: "center" }}>{formatDateTime(f.scheduled_arrival)}</TableCell>
                                    <TableCell sx={{ fontSize: "11px", py: 0.3, textAlign: "center" }}>{f.airline}</TableCell>
                                    <TableCell align="right" sx={{ fontSize: "11px", py: 0.3, textAlign: "center" }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ backgroundColor: "rgba(0, 60, 100, 0.96)" }}
                                            onClick={() => handleView(f)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No flights found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {
                filtered.length > rowsPerPage && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={Math.ceil(filtered.length / rowsPerPage)}
                            page={currentPage}
                            onChange={(_, page) => setCurrentPage(page)}
                        />
                    </Box>
                )
            }

            {
                selectedFlight && (
                    <FlightDialog
                        open={dialogOpen}
                        flight={selectedFlight}
                        onClose={() => setDialogOpen(false)}
                        onSave={handleSave}
                    />
                )
            }
        </Box >
    )
}

export default FlightHistory
