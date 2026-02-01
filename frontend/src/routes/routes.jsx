import { element } from 'prop-types';
import React from 'react'
import Dashboard from '../pages/Dashboard';
import AddNewCustomer from '../pages/AddNewCustomer';

import AddItems from '../pages/AddItems';
import ViewItems from '../pages/ViewItems';
import SalesReport from '../pages/Salesreport';
import CustomerReport from '../pages/CustomerReport';
import Help from '../pages/Help';


import FlightTabs from '../pages/Flights/Upload/FlightTabs';
import ViewFlights from '../pages/Flights/View/ViewFlights';
import HolidayTabs from '../pages/Holiday/Upload/HolidayTabs';
import ViewHolidays from '../pages/Holiday/View/ViewHolidays';
import AddNewUser from '../pages/Users/AddNewUser';
import ViewUser from '../pages/Users/ViewUser';
import FlightInputForm from '../pages/Prediction/FlightInputForm';

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/flight-details', name: 'FlightTabs', element: FlightTabs },
  { path: '/flight-view', name: 'ViewFlights', element: ViewFlights },
  { path: '/holiday-details', name: 'HolidayTabs', element: HolidayTabs },
  { path: '/holiday-view', name: 'ViewHolidays', element: ViewHolidays },
  { path: '/add-user', name: 'AddNewUser', element: AddNewUser },
  { path: '/view-user', name: 'ViewUser', element: ViewUser },

  { path: '/main/help', name: 'Help', element: Help },
  { path: '/dashboard', name: 'Dashboard', element: FlightInputForm },

  { path: '/main/items/new', name: 'AddItems', element: AddItems },
  { path: '/main/items/view-or-modify', name: 'ViewItems', element: ViewItems },
  { path: 'main/reports/sales', name: 'SalesReport', element: SalesReport },
  { path: '/main/reports/customer', name: 'CustomerReport', element: CustomerReport },

]

export default routes;
