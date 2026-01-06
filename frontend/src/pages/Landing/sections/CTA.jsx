import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { FaPlaneDeparture } from "react-icons/fa";

const CTA = () => {
  return (
    <Box
      sx={{
        py: 5,
        background:
          "linear-gradient(135deg, #090774ff 0%, #cbd0fcff 100%)",
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
                    sx={{
    backgroundColor: "blue.main",
    "&:hover": {
      backgroundColor: "blue.dark",
    },
  }}
            endIcon={<FaPlaneDeparture />}
            onClick={() => navigate("/login")}
            >Predict Now
            </CustomButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTA;
