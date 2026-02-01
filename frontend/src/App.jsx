import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Register from "./pages/Users/Register";
import Login from "./pages/Users/Login";
import LandingPage from "./pages/Landing/LandingPage";
import ResetPassword from "./pages/Users/ResetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import DefaultLayout from "./layout/DefaultLayout";
import { AppThemeProvider } from "./styles/AppThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSpinner } from "@coreui/react";

function App() {
  return (
    <AppThemeProvider>
      {({ mode, toggleTheme }) => (
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>
            }>
            <ToastContainer
              position="top-center"
              limit={1}
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={mode === "dark" ? "dark" : "light"}
            />
            <Routes>
              <Route path="/" element={<LandingPage mode={mode} toggleTheme={toggleTheme} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/*"
                element={
                  <PrivateRoute>
                    <DefaultLayout mode={mode} toggleTheme={toggleTheme} />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      )}
    </AppThemeProvider>
  );
}

export default App;
