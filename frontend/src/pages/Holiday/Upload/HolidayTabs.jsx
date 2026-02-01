import { Box, Paper, Tab, Tabs, Typography, Divider, useTheme } from '@mui/material';
import { useState } from 'react';
import UploadHolidayCSV from './UploadHolidayCSV';
import AddSingleHoliday from './AddSingleHoliday';

export default function HolidayTabs() {
    const [tab, setTab] = useState(0);
    const theme = useTheme();

    return (
        <>
            <Box p={3}>
                <Box sx={{ marginBottom: "30px" }}>
                    <Typography variant="h5" style={{
                        border: "none",
                        fontSize: "1.2rem",
                        fontWeight: 'bold',
                        color: theme.palette.text.main,
                        marginBottom: "10px"
                    }}>
                        Holiday Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Upload bulk holiday data or add individual holiday records
                    </Typography>
                </Box>
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 1,
                        overflow: 'hidden',
                    }}
                >
                    {/* Tabs Header */}
                    <Box
                        sx={{
                            px: 3,
                            pt: 2,
                            background:
                                'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
                        }}
                    >
                        <Tabs
                            value={tab}
                            onChange={(e, val) => setTab(val)}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                                minHeight: 52,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    minHeight: 52,
                                    px: 3,
                                },
                            }}
                        >
                            <Tab label="Upload Holiday CSV" />
                            <Tab label="Add Holidays Manually" />
                        </Tabs>
                    </Box>

                    <Divider />

                    {/* Tab Content */}
                    <Box
                        sx={{
                            p: { xs: 1, sm: 2, md: 3 },
                            backgroundColor: 'background.paper',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                    >
                        {tab === 0 && <UploadHolidayCSV />}
                        {tab === 1 && <AddSingleHoliday />}
                    </Box>

                </Paper>
            </Box>
        </>
    );
}
