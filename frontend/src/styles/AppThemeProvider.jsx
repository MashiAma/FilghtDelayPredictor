import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";

export const AppThemeProvider = ({ children }) => {
    const [mode, setMode] = useState("light");

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"))
    }

    // const muiTheme = useMemo(() =>
    //     createTheme({
    //         ...baseTheme,
    //         palette: {
    //             ...baseTheme.palette,
    //             mode: dark ? "dark" : "light",
    //         },
    //     }), [dark]
    // );
    const theme = useMemo(() => getTheme(mode), [mode]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--color-primary", theme.palette.primary.main);
        root.style.setProperty("--color-secondary", theme.palette.secondary.main);
        root.style.setProperty("--color-bg-default", theme.palette.background.default);
        root.style.setProperty("--color-bg-paper", theme.palette.background.paper);
        root.style.setProperty("--color-text-primary", theme.palette.text.primary);
        root.style.setProperty("--color-text-secondary", theme.palette.text.secondary);
        root.style.setProperty("--color-text-main", theme.palette.text.main);
        //chart

        root.style.setProperty("--chart-bg", theme.palette.background.paper);
        root.style.setProperty("--chart-text", theme.palette.text.primary);


    }, [theme]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children({ mode, toggleTheme })}
        </ThemeProvider>
    );
}
