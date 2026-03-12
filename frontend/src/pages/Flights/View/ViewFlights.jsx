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
import { getAllFlights } from '../../../services/authService'
import FlightDialog from './FlightDialog'   // adjust path if needed
import { updateFlight } from '../../../services/authService'

/* ---------- Date helpers ---------- */
const toDate = (dateTimeStr) => new Date(dateTimeStr.replace(' ', 'T'))

const formatDateTime = (dateTimeStr) =>
  toDate(dateTimeStr).toLocaleString()

const isTodayOrFuture = (dateTimeStr) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = toDate(dateTimeStr)
  date.setHours(0, 0, 0, 0)

  return date >= today
}
/* --------------------------------- */

const ViewFlights = () => {
  const [flightsByAirport, setFlightsByAirport] = useState({})
  const [airports, setAirports] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const theme = useTheme();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)

  const rowsPerPage = 8

  /* ---------- Fetch flights ---------- */
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await getAllFlights()
        const allFlights = response.data

        const upcomingFlights = allFlights.filter(f =>
          isTodayOrFuture(f.scheduled_departure)
        )

        const grouped = {}
        upcomingFlights.forEach(flight => {
          const airport = flight.arrival_airport
          if (!grouped[airport]) grouped[airport] = []
          grouped[airport].push(flight)
        })

        setFlightsByAirport(grouped)
        setAirports(Object.keys(grouped))
      } catch {
        toast.error('Failed to fetch flights')
      }
    }

    fetchFlights()
  }, [])

  /* ---------- Helpers ---------- */
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
      await updateFlight(updatedFlight.id, updatedFlight);

      // Update UI without refetch
      setFlightsByAirport(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(airport => {
          updated[airport] = updated[airport].map(f =>
            f.id === updatedFlight.id ? updatedFlight : f
          );
        });

        return updated;
      });

      toast.success("Flight updated successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update flight");
    }
  };


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
            Upcoming Flight Details
          </Typography>

          {/* RIGHT: SEARCH */}
          <TextField
            size="small"
            placeholder="Search by ariline..."
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
                <TableCell sx={{ fontWeight: "bold" }}>Flight No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Scheduled Departure</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Scheduled Arrival</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Airline</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell sx={{ py: 0.5 }}>{f.flight_number}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{formatDateTime(f.scheduled_departure)}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{formatDateTime(f.scheduled_arrival)}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{f.airline}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
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

        {filtered.length > rowsPerPage && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filtered.length / rowsPerPage)}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
            />
          </Box>
        )}

        {/* ---------- Flight Dialog ---------- */}
        {selectedFlight && (
          <FlightDialog
            open={dialogOpen}
            flight={selectedFlight}
            onClose={() => setDialogOpen(false)}
            onSave={handleSave}
          />
        )}
      </Box>
    </>
  )
}

export default ViewFlights
