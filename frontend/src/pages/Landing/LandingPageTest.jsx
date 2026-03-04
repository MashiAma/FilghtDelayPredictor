import React, { useContext } from "react";
import { Box, Typography, Button, Grid, Container, Paper, IconButton, useTheme, Card, CardContent, } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { FaHeartbeat, FaStethoscope, FaChartLine } from "react-icons/fa";
import AppHeaderDropdown from "../../components/AppHeaderDropdown";
import { NavLink } from "react-router-dom";
import logo from "./../../assets/images/logo.png"; // replace with your logo
import { motion, useAnimation, useInView } from "framer-motion";
import flightImg from "../../assets/images/flight-hero.jpg";
import { useRef } from "react";
import Footer from "../../components/Footer";
import PageTransition from "../../assets/animations/Pagetransition";
import { FaPlane, FaCloudSun, FaCalendarAlt } from "react-icons/fa";
import HowItWorks from "./sections/HowItWorks";
import CTA from "./sections/CTA";


const features = [
    {
        icon: <FaPlane size={28} />,
        title: "Real-Time Predictions",
        desc: "Instant AI-based delay predictions.",
    },
    {
        icon: <FaCloudSun size={28} />,
        title: "Weather Intelligence",
        desc: "Monsoon and weather pattern analysis.",
    },
    {
        icon: <FaCalendarAlt size={28} />,
        title: "Holiday Awareness",
        desc: "Detect holiday-related congestion risks.",
    },
    {
        icon: <FaCalendarAlt size={28} />,
        title: "Explainable Recommendations",
        desc: "Provide Explainable Analysis",
    },
];

const steps = ["Input Your Data", "AI Predicts Levels", "Receive Insights"];

const LandingPage = ({ mode, toggleTheme }) => {
    const theme = useTheme();

    // Scroll animation hook
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    if (inView) controls.start("visible");

    return (
        <PageTransition>
            <Box sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                overflowX: "hidden",
            }}>
                {/* Header */}
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        bgcolor: "primary.main",
                        boxShadow: 3,
                    }}
                >
                    <Container maxWidth="xl">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5 }}>
                            <Box to="/" sx={{ display: "flex", alignItems: "center" }}>
                                <Box component="img" src={logo} alt="SkyGuard" sx={{ height: 50, mr: 1 }} />
                                <Typography variant="h5" fontWeight="bold" sx={{ mr: 10, color: 'inherit', textDecoration: 'none' }}>
                                    SkyGuard
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <IconButton onClick={toggleTheme} sx={{ coloe: "grey" }}>
                                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                                {/* <AppHeaderDropdown /> */}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Hero Section */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 6,
                        px: 4,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Floating Blobs */}
                    <motion.div
                        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: -50,
                            left: -50,
                            width: 250,
                            height: 250,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #64B5F6, #BA68C8)",
                            opacity: 0.2,
                            zIndex: 0,
                        }}
                    />
                    <motion.div
                        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: -50,
                            width: 300,
                            height: 300,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #FF8A65, #FFEB3B)",
                            opacity: 0.2,
                            zIndex: 0,
                        }}
                    />

                    {/* Hero Text */}
                    <Box sx={{ flex: 1, zIndex: 1, mt: -10 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography variant="h2" fontWeight="bold" gutterBottom>
                                Predict Flight Delays with AI Precision
                            </Typography>
                            <Typography variant="h6" color="text.secondary" mb={4}>
                                AI-powered flight delay prediction with probability scoring,
                                explainable machine learning insights, and LLM-generated
                                operational risk analysis.
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "blue.main",
                                    "&:hover": {
                                        backgroundColor: "blue.dark",
                                    },
                                }}
                                size="large"
                                component={NavLink}
                                to="/login"
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Hero Image */}
                    <Box sx={{ flex: 1, mt: { xs: 6, md: 0 } }}>
                        <motion.img
                            src={flightImg}
                            alt="Hero"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            style={{ width: "100%", maxWidth: 600, zIndex: 1, borderRadius: 10 }}
                        />
                    </Box>
                </Box>

                {/* Features Section */}
                <Container sx={{ py: 8 }}>
                    <Typography variant="h4" textAlign="center" mb={4} sx={{ color: 'inherit', }}>
                        Key Features
                    </Typography>
                    <Box display="grid" gridTemplateColumns={{ md: "repeat(4,1fr)" }} gap={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 200 }}
                                >
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            bgcolor: "primary.main",
                                            color: "white",
                                            textAlign: "center",
                                            height: "100%", // ensures all cards are equal height
                                        }}
                                    >
                                        <Box mb={2}>{feature.icon}</Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2">{feature.description}</Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Box>
                </Container>

                {/* How it Works Section */}
                {/* <Container sx={{ bgcolor: "background.paper", py: 4 }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                        How It Works
                    </Typography>
                    <Box display="grid" gridTemplateColumns={{ md: "repeat(3,1fr)" }} gap={4} >
                        {steps.map((step, idx) => (
                            <Grid size={{ xs: 12, sm: 4, md: 4 }} key={idx} >
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.3 }}
                                >
                                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center", bgcolor: "background.default", }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Step {idx + 1}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {step}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Box>
                </Container > */}
                {/* <HowItWorks /> */}
                <CTA />

                <Footer />
            </Box >
        </PageTransition >
    );
};

export default LandingPage;
