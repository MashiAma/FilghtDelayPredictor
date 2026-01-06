// src/components/CustomButton/CustomButton.jsx
import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { buttonStyles } from "./CustomButton.styles";

const CustomButton = ({
  children,
  loading = false,
  startIcon,
  endIcon,
  variant = "contained",
  color = "primary",
  sx = {},
  fullWidth = false,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={loading}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      sx={{ ...buttonStyles, ...sx }}
      {...props}
    >
      {loading ? (
        <CircularProgress size={22} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
