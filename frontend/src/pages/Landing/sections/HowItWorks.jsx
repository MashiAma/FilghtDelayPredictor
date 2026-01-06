import { Box, Typography, Container, Paper } from "@mui/material";
import { motion } from "framer-motion";

const steps = [
  "Enter Flight Details",
  "AI Analyzes Data",
  "Get Delay Prediction",
];

const HowItWorks = () => {
  return (
    <Box sx={{ py: 10 }}>
      <Container>
        <Typography variant="h3" textAlign="center" mb={6}>
          How It Works
        </Typography>

        <Box display="grid" gridTemplateColumns={{ md: "repeat(3,1fr)" }} gap={4}>
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h4" color="primary">
                  {idx + 1}
                </Typography>
                <Typography>{step}</Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
