import { element } from 'prop-types';
import React from 'react'
import Help from '../pages/Help';


import FlightTabs from '../pages/Flights/Upload/FlightTabs';
import ViewFlights from '../pages/Flights/View/ViewFlights';
import HolidayTabs from '../pages/Holiday/Upload/HolidayTabs';
import ViewHolidays from '../pages/Holiday/View/ViewHolidays';
import AddNewUser from '../pages/Users/AddNewUser';
import ViewUser from '../pages/Users/ViewUser';
import FlightInputForm from '../pages/Prediction/FlightInputForm';
import AdminDashboard from '../pages/AdminDashboard';
import FlightPredictionReport from '../pages/Reports/FlightPredictionReport';
import AdminPredictionReport from '../pages/Reports/AdminPredictionReport';
import FlightHistory from '../pages/Flights/FlightHistory';
import HolidayHistory from '../pages/Holiday/HolidayHistory';

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/flight-details', name: 'FlightTabs', element: FlightTabs },
  { path: '/flight-view', name: 'ViewFlights', element: ViewFlights },
  { path: '/holiday-details', name: 'HolidayTabs', element: HolidayTabs },
  { path: '/holiday-view', name: 'ViewHolidays', element: ViewHolidays },
  { path: '/add-user', name: 'AddNewUser', element: AddNewUser },
  { path: '/view-user', name: 'ViewUser', element: ViewUser },
  { path: '/admin-dashboard', name: 'AdminDashboard', element: AdminDashboard },
  { path: '/main/help', name: 'Help', element: Help },
  { path: '/dashboard', name: 'Dashboard', element: FlightInputForm },
  { path: '/flight-history', name: 'FlightHistory', element: FlightHistory },
  { path: '/holiday-history', name: 'HolidayHistory', element: HolidayHistory },
  { path: '/reports/prediction-report', name: 'FlightPredictionReport', element: FlightPredictionReport },
  { path: '/reports/admin-prediction-report', name: 'AdminPredictionReport', element: AdminPredictionReport },

  // { path: 'main/reports/sales', name: 'SalesReport', element: SalesReport },
  // { path: '/main/reports/customer', name: 'CustomerReport', element: CustomerReport },

]

export default routes;
