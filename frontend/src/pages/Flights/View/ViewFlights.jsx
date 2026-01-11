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
  Button
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

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)

  const rowsPerPage = 5

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
      f.departure_airport.toLowerCase().includes(searchTerm.toLowerCase())
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
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Arrival Flights (Today & Upcoming)
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by flight number or origin..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1)
        }}
        sx={{ mb: 2 }}
      />

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
              <TableCell>Flight No</TableCell>
              <TableCell>Scheduled Departure</TableCell>
              <TableCell>Scheduled Arrival</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((f) => (
                <TableRow key={f.flight_number}>
                  <TableCell>{f.flight_number}</TableCell>
                  <TableCell>{formatDateTime(f.scheduled_departure)}</TableCell>
                  <TableCell>{formatDateTime(f.scheduled_arrival)}</TableCell>
                  <TableCell>{f.airline}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ backgroundColor: '#02187d' }}
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
  )
}

export default ViewFlights
