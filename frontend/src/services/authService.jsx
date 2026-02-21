import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// user endpoints
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getAllUsers = () => API.get('/auth/get-all-users');
export const getUser = (email) => API.get(`/auth/get-user-by-email/${email}`);
export const updateUser = (email, data) => API.put(`/auth/update-profile/${email}`, data);
export const updateUserStatus = (email, is_active) => {
  return API.patch(`/auth/account-status/${email}`, {
    is_active,
  })
}
export const verifyPassword = (data) => API.post('/auth/verify-password', data);
export const changePassword = (data) => API.put('/auth/change-password', data);
export const resetPasswordRequest = (email) => API.post('/auth/reset-password-request', { email });
export const verifyAndResetPassword = (data) => API.post('/auth/reset-password-verify', data);




export const addFlight = (data) => API.post("/flights/add-flight", data);   // Single flight addition
export const uploadFlightsCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await API.post("/flights/upload-flight-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // <-- Only return backend JSON
  } catch (error) {
    // Forward backend errors if available
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error; // Rethrow if no backend data
  }
};
export const updateFlight = (flightId, data) => API.put(`/flights/update-flight/${flightId}`, data);      // Update a flight
export const getAllFlights = () => API.get('/flights/get-All-flights/');     // Get flights
export const fetchDepartureTimes = (params) =>
  API.get("/flights/departure-times", { params });



export const getAllHolidays = () => API.get("/holidays/get-all-holidays");             // Get all holidays
export const addHoliday = (data) => API.post("/holidays/add-holiday", data);     // Add a single holiday
export const uploadHolidaysCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await API.post("/holidays/upload-holiday-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // <-- Only return backend JSON
  } catch (error) {
    // Forward backend errors if available
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error; // Rethrow if no backend data
  }
};
export const updateHoliday = (holidayId, data) => API.put(`/holidays/update-holiday/${holidayId}`, data);      // Update a holiday



export const submitPrediction = (payload) =>
  API.post("/predictions/predict", payload);

// export const getFlightPredictions = (flightId) => API.get(`/predictions/flight/${flightId}`);     // Get predictions for a specific flight
// export const getDelayClassification = () => API.get("/predictions/delay-classification");   // Get delay classification

// Admin dashboard
export const getAdminDashboardStats = () => {
  return API.get("/admin/stats");
};
export const getAdminDashboard = () => {
  return API.get("/admin/admin-dashboard");
};



// Reports
export const getUserPredictionReport = (user_email, from_date, to_date) => {
  return API.get(`/report/user-prediction-report?user_email=${user_email}&start_date=${from_date}&end_date=${to_date}`);
};

export const getAdminPredictionReport = (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  return API.get("/report/admin-prediction-report", { params });
};


export const createAlert = (data) => API.post("/alert/", data);           // Create an alert
export const getUserAlerts = (userId) => API.get(`/alert/user/${userId}`);      // Get user alerts
export const markAlertRead = (alertId) => API.put(`/alert/${alertId}/read`);      // Mark an alert as read
