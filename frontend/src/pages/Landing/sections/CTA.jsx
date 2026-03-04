import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { FaPlaneDeparture } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const CTA = () => {
  return (
    <Box
      sx={{
        py: 5,
        background:
          "linear-gradient(135deg, rgb(0, 62, 133) 0%, #cbd0fcff 100%)",
      }}
    >
      <Container>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          <Typography variant="h4" textAlign="center" mb={2}>
            Ready to Predict Your Flight Delay?
          </Typography>

          <Typography textAlign="center" mb={4}>
            Get AI-powered insights in seconds.
          </Typography>

          <Box textAlign="center">
            <CustomButton
              variant="contained"
              color="inherit"
              size="large"
              component={NavLink}
              to="/register"
              sx={{ mt: 3 }}
              endIcon={<FaPlaneDeparture />}
            >Sign Up Now
            </CustomButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTA;
