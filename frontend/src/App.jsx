import React, { useState, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Users/Register';
import Login from './pages/Users/Login';
import LandingPage from './pages/Landing/LandingPage';
import ResetPassword from './pages/Users/ResetPassword';
import PrivateRoute from './routes/PrivateRoute';
import DefaultLayout from './layout/DefaultLayout';
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-center"
        limit={1}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="*"
            //name="Home"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
