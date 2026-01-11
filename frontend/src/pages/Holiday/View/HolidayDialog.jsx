import React, { useState } from "react";
import {
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

/* ---------- Holiday Types ---------- */
const HOLIDAY_TYPES = [
    "Public Holiday",
    "Religious Holiday",
    "National Holiday",
    "Bank Holiday",
    "School Holiday",
    "Festival",
];
/* ---------------------------------- */

const HolidayDialog = ({ open, holiday, onClose, onSave }) => {
    const [isEditable, setIsEditable] = useState(false);

    /* ---------- Editable Fields ---------- */
    const [holidayDate, setHolidayDate] = useState(holiday.holiday_date);
    const [holidayName, setHolidayName] = useState(holiday.holiday_name);
    const [holidayType, setHolidayType] = useState(holiday.holiday_type);
    /* ------------------------------------ */

    const toggleEdit = () => {
        setIsEditable((prev) => !prev);
    };

    const handleSave = () => {
        const updatedHoliday = {
            ...holiday,
            holiday_date: holidayDate,
            holiday_name: holidayName,
            holiday_type: holidayType,
        };

        onSave(updatedHoliday);
        setIsEditable(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    backgroundColor: "#02187d",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Holiday Details
                <Tooltip title={isEditable ? "Disable Editing" : "Enable Editing"}>
                    <IconButton onClick={toggleEdit} sx={{ color: "white" }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={2}>

                    {/* ---------- EDITABLE FIELDS ---------- */}
                    <Grid item xs={12}>
                        <TextField
                            label="Holiday Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                            fullWidth
                            disabled={!isEditable}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Holiday Name"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                            fullWidth
                            disabled={!isEditable}
                            placeholder="e.g. Sinhala & Tamil New Year"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Holiday Type"
                            select
                            fullWidth
                            value={holidayType}
                            onChange={(e) => setHolidayType(e.target.value)}
                            disabled={!isEditable}
                        >
                            {HOLIDAY_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#02187d" }}
                    onClick={handleSave}
                    disabled={!isEditable}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default HolidayDialog;
