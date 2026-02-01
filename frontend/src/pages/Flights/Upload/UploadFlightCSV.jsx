import { Box, Button, Paper, Typography, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadFlightsCSV } from '../../../services/authService';

export default function UploadFlightCSV() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]); // store row-level errors

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.name.endsWith('.csv')) {
            toast.error('Only CSV files are allowed');
            return;
        }

        setFile(selected);
        setErrors([]); // clear previous errors
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a CSV file');
            return;
        }

        try {
            setLoading(true);

            const data = await uploadFlightsCSV(file);

            if (data.success) {
                toast.success(`Flight CSV uploaded successfully. Added ${data.added_records} records.`);
                setFile(null);
                setErrors([]);
            } else if (data.errors?.length > 0) {
                setErrors(data.errors);
                toast.error(`Upload Failed with ${data.errors.length} error(s).`);
            } else {
                toast.error('CSV upload failed');
            }
        } catch (err) {
            toast.error('CSV upload failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                textAlign: 'center',
                borderStyle: 'dashed',
                borderRadius: 2,
            }}
        >
            <CloudUploadIcon sx={{ fontSize: 50, color: 'primary.main' }} />

            <Typography variant="h6" mt={2}>
                Upload Flight CSV
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                CSV should include: flight_number, departure_airport, arrival_airport, scheduled_departure, scheduled_arrival, airline, status, aircraft
            </Typography>

            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" mb={2}>
                <Button
                    variant="outlined"
                    size="small"
                    component="label"
                // disabled={Boolean(file) || loading}
                >
                    Choose CSV
                    <input hidden type="file" accept=".csv" onChange={handleFileChange} />
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    disabled={!file || loading}
                    onClick={handleUpload}
                >
                    {loading ? 'Uploading…' : 'Upload'}
                </Button>
            </Stack>

            {file && (
                <Typography mt={1.5} fontSize={13} color="text.secondary">
                    Selected: <strong>{file.name}</strong>
                </Typography>
            )}

            {errors.length > 0 && (
                <Box mt={3} textAlign="left">
                    <Typography variant="subtitle1" mb={1} color="error">
                        Errors in CSV:
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Row</TableCell>
                                <TableCell>Error</TableCell>
                                <TableCell>Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {errors.map((err, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{err.row}</TableCell>
                                    <TableCell>{err.error}</TableCell>
                                    <TableCell>
                                        <pre style={{ margin: 0, fontSize: '0.75rem' }}>
                                            {JSON.stringify(err.row_data, null, 2)}
                                        </pre>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Paper>
    );
}
