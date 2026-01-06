import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { FaPlane, FaCloudSun, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

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

const Features = () => {
  return (
    <Box sx={{ py: 5, backgroundColor: "background.normal" }}>
      <Container>
        <Typography variant="h4" textAlign="center" color="text.secondary" mb={4}>
          Key Features
        </Typography>

        <Box display="grid" gridTemplateColumns={{ md: "repeat(4,1fr)" }} gap={4}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card elevation={10}>
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Box color="blue.main" mb={2}>
                    {f.icon}
                  </Box>
                  <Typography variant="h6">{f.title}</Typography>
                  <Typography color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
