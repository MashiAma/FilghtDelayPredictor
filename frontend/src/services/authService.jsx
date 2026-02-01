import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:8000",
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





export const submitPrediction = (data) => API.post("/predictions/", data);          // Submit a flight for prediction
export const getFlightPredictions = (flightId) => API.get(`/predictions/flight/${flightId}`);     // Get predictions for a specific flight
export const getPredictionHistory = () => API.get("/predictions/history");        // Get prediction history
export const getDelayClassification = () => API.get("/predictions/delay-classification");   // Get delay classification




export const createAlert = (data) => API.post("/alert/", data);           // Create an alert
export const getUserAlerts = (userId) => API.get(`/alert/user/${userId}`);      // Get user alerts
export const markAlertRead = (alertId) => API.put(`/alert/${alertId}/read`);      // Mark an alert as read



export const addItem = (itemData) => API.post('/items/add', itemData);                                      // Add a new item
export const getAllItems = () => API.get('/items');                                                        // Get all items
export const updateItem = (itemData) => API.put('/items/update', itemData);                               // Update an item
export const deleteItem = (itemId) => API.delete(`/items/delete/${itemId}`);                             // Delete an item
export const searchItemsWithPrices = (name) => API.get(`/items/search-with-prices?name=${name}`);        // Search items by name only
export const addItemPrice = (itemId, priceData) =>                                                     // Add a price to a specific item
  API.post(`/items/prices/${itemId}`, priceData);


