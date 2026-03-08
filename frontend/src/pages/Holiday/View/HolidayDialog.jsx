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

/* ---------- Holiday Types ---------- */
const HOLIDAY_TYPES = [
    "Public",
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
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <Box style={{
                    backgroundColor: "rgba(0, 60, 100, 0.96)",
                }}>
                    <DialogTitle style={{
                        border: "none",
                        fontSize: "1.2rem", color: 'white', fontWeight: 'bold', justifyContent: "space-between"
                    }}>
                        Holiday Details
                        <Tooltip title={isEditable ? "Disable Editing" : "Enable Editing"}>
                            <IconButton onClick={toggleEdit} sx={{ color: "white" }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </DialogTitle>
                </Box>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2}>

                        {/* ---------- EDITABLE FIELDS ---------- */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Holiday Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={holidayDate}
                                onChange={(e) => setHolidayDate(e.target.value)}
                                fullWidth
                                disabled={!isEditable}
                                size="medium"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Holiday Name"
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                                fullWidth
                                disabled={!isEditable}
                                placeholder="e.g. Sinhala & Tamil New Year"
                                size="medium"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Holiday Type"
                                select
                                fullWidth
                                value={holidayType}
                                onChange={(e) => setHolidayType(e.target.value)}
                                disabled={!isEditable}
                                size="medium"
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

export default HolidayDialog;
