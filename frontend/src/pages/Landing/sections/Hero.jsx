import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import flightImg from "../../../assets/images/flight-hero.jpg";
import CustomButton from "../../../components/CustomButton/CustomButton";

const Hero = () => {
  return (
    <Box sx={{ mt:0, mb:5 }}>
      <Container maxWidth="lg">
        <Box
          display="grid"
          gridTemplateColumns={{ md: "1fr 1fr" }}
          gap={6}
          alignItems="center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" gutterBottom>
              Predict Flight Delays with AI Precision
            </Typography>

            <Typography color="text.secondary" mb={4}>
              SkyGuard analyzes historical data, weather patterns, and seasonal
              trends to give real-time delay predictions.
            </Typography>

            <CustomButton
            sx={{
    backgroundColor: "blue.main",
    "&:hover": {
      backgroundColor: "blue.dark",
    },
  }}
            onClick={() => navigate("/login")}
            >Predict Now
            </CustomButton>
          </motion.div>

          <motion.img
            src={flightImg}
            alt="Flight"
            style={{ width: "100%" }}
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
