import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#4F8CFF",
      dark: "#2563EB",
      light: "#93B4FF",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#6C72FF",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#0E1325",   // Lighter page background
      paper: "#1a203dff",     // Noticeably lighter cards
    },

    text: {
      primary: "#E8EBF2",
      secondary: "#B6BCD1",
    },

    divider: "#2A3358",

    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    info: { main: "#38BDF8" },
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#232B52", // lighter than card
          borderRadius: 12,
        },
        notchedOutline: {
          borderColor: "#2F3A6B",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#B6BCD1",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 22px",
          borderRadius: 12,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 56,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
