// src/components/CustomButton/CustomButton.styles.js
import { alpha } from "@mui/material/styles";

export const buttonStyles = (theme) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 5,
  padding: "12px 28px",
  fontSize: "1rem",
  letterSpacing: "0.3px",
  transition: "all 0.3s ease",
  boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.35)}`,

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.55)}`,
  },

  "&:disabled": {
    opacity: 0.6,
    boxShadow: "none",
  },
});
