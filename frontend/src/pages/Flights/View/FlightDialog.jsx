import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
  MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

/* ---------- Date helpers (REQUIRED FIX) ---------- */
const parseDateTime = (value) => {
  const d = new Date(value);
  return {
    date: d.toISOString().split("T")[0],   // YYYY-MM-DD
    time: d.toTimeString().slice(0, 5)     // HH:mm
  };
};
/* ------------------------------------------------ */

const FlightDialog = ({ open, flight, onClose, onSave }) => {
  const [isEditable, setIsEditable] = useState(false);

  // Editable fields
  const [status, setStatus] = useState(flight.status);
  const [aircraft, setAircraft] = useState(flight.aircraft);

  /* ---------- FIXED parsing ---------- */
  const dep = parseDateTime(flight.scheduled_departure);
  const arr = parseDateTime(flight.scheduled_arrival);

  const [depDate, setDepDate] = useState(dep.date);
  const [depTime, setDepTime] = useState(dep.time);

  const [arrDate, setArrDate] = useState(arr.date);
  const [arrTime, setArrTime] = useState(arr.time);
  /* ----------------------------------- */

  const toggleEdit = () => {
    setIsEditable(prev => !prev);
  };

  const handleSave = () => {
    const updatedFlight = {
      ...flight,
      status,
      aircraft,
      scheduled_departure: `${depDate} ${depTime}:00`,
      scheduled_arrival: `${arrDate} ${arrTime}:00`,
    };

    onSave(updatedFlight);
    setIsEditable(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <Box style={{
          backgroundColor: "rgba(0, 60, 100, 0.96)",
        }}>
          <DialogTitle style={{
            border: "none",
            fontSize: "1.2rem", color: 'white', fontWeight: 'bold', justifyContent: "space-between"
          }}>
            Flight Details
            <Tooltip title={isEditable ? "Disable Editing" : "Enable Editing"}>
              <IconButton onClick={toggleEdit} sx={{ color: "white" }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
        </Box>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>

            {/* ---------- NON-EDITABLE ---------- */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Flight Number" value={flight.flight_number} fullWidth disabled size="small" />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Airline" value={flight.airline} fullWidth disabled size="small" />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Departure Airport" value={flight.departure_airport} fullWidth disabled size="small" />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Arrival Airport" value={flight.arrival_airport} fullWidth disabled size="small" />
            </Grid>

            {/* ---------- EDITABLE ---------- */}


            {/* ---------- Scheduled Departure ---------- */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Departure Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
                fullWidth
                disabled={!isEditable}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Departure Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={depTime}
                onChange={(e) => setDepTime(e.target.value)}
                fullWidth
                disabled={!isEditable}
                size="small"
              />
            </Grid>

            {/* ---------- Scheduled Arrival ---------- */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Arrival Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={arrDate}
                onChange={(e) => setArrDate(e.target.value)}
                fullWidth
                disabled={!isEditable}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Arrival Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={arrTime}
                onChange={(e) => setArrTime(e.target.value)}
                fullWidth
                disabled={!isEditable}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                label="Status"
                select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isEditable}
                size="small"
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Delayed">Delayed</MenuItem>
                <MenuItem value="Boarding">Boarding</MenuItem>
                <MenuItem value="Departed">Departed</MenuItem>
                <MenuItem value="Arrived">Arrived</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <TextField
                label="Aircraft"
                value={aircraft}
                onChange={(e) => setAircraft(e.target.value)}
                fullWidth
                disabled={!isEditable}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "rgba(0, 60, 100, 0.96)", }}
            onClick={handleSave}
            disabled={!isEditable}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FlightDialog;
