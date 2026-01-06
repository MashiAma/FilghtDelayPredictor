import { Box, Typography, Container, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ py: 4, backgroundColor: "#0B0820" }}>
      <Container>
        <Stack spacing={1} textAlign="center">
          <Typography variant="h6" color="text.primary">SkyGuard </Typography>
          <Typography color="text.secondary">
            AI-Powered Flight Delay Prediction System
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} SkyGuard. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
             <span className="me-1">Powered by</span>
        <a href="#" style={{color:"#02187dff"}}>
          MashiAma Creation
        </a>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
