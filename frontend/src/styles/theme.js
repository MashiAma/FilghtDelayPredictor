import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "rgba(0, 60, 100, 0.96)", },
      secondary: { main: "rgba(0, 60, 128, 0.41)" },
      // primary: { main: "#006577", dark: "#009499", contrastText: "#FFFFFF" }, // Sky blue
      // secondary: { main: "#002b3f", contrastText: "#FFFFFF" }, // Green
      background: {
        default: mode == "dark" ? "#000000ff" : "#f1f1f1ff",
        paper: mode == "dark" ? " #1c1c1cff" : "#ffffff",
      },
      // background: {
      //   default: mode === 'dark' ? "#F3F4F6" : "#000000", main: "#006577", paper: "#111827", normal: "#F3F4F6"
      // }, 
      text: {
        primary: mode === "dark" ? "#dadadaff" : "#000000ff",
        secondary: mode === "dark" ? "#ffffffff" : "#6e6e6eff",
        main: mode === "dark" ? "rgba(0, 104, 223, 0.81)" : "#001431d8",
      },
      info: { main: "#38BDF8", contrastText: "#082F49" },
      success: { main: "#22C55E", contrastText: "#052E16" },
      warning: { main: "#F59E0B", contrastText: "#451A03" },
      error: { main: "#EF4444", contrastText: "#450A0A" },
    },

    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      h1: {
        fontiWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontweight: 700,
        letterSpacing: "-0.02em",
      },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h6: {
        fontiWeight: 700,
        fontSize: "16px",
        letterSpacing: "-0.02em",
      },
      body1: {
        fontSize: "12px",
        letterSpacing: "-0.02em",
      },
      body2: {
        fontSize: "11px",
        letterSpacing: "-0.02em",
      },
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
    shape: {
      borderRadius: 14,
    },
    breakpoints: {
      values: {
        xs: 0,
        ms: 768,
        md: 1024,
        lg: 1366,
        x1: 1600,
      },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            disableRipple: true,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "11px",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            cursor: "pointer",
          },
        },
      },
    },

  });
