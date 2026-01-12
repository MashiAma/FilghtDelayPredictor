import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilCalculator,
  cilPencil,
  cilSpeedometer,
  cilUserPlus,
  cilPlus,
  cilBook,
  cilAddressBook,
  cilNoteAdd,
  cilCash
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    roles: ['admin'],
  },
  {
    component: CNavItem,
    name: 'Bill Generator',
    to: '/bill-generator',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    roles: ['admin', 'normal'],
  },
  {
    component: CNavTitle,
    name: 'main',
  },
  {
    component: CNavGroup,
    name: 'Flights',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    roles: ['admin', 'normal'],
    items: [
      {
        component: CNavItem,
        name: 'Add New',
        to: '/flight-details',
        icon: <CIcon icon={cilPlus} style={{ marginRight: "10px" }} />,
        roles: ['admin', 'normal'],
      },
      {
        component: CNavItem,
        name: 'View/Modify',
        to: '/flight-view',
        icon: <CIcon icon={cilPencil} style={{ marginRight: "10px" }} />,
        roles: ['admin', 'normal'],
      },
      {
        component: CNavItem,
        name: 'History',
        to: '/flight-history',
        icon: <CIcon icon={cilPencil} style={{ marginRight: "10px" }} />,
        roles: ['admin', 'normal'],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Holidays',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    roles: ['admin', 'normal'],
    items: [
      {
        component: CNavItem,
        name: 'Add New',
        to: '/holiday-details',
        icon: <CIcon icon={cilPlus} style={{ marginRight: "10px" }} />,
        roles: ['admin', 'normal'],
      },
      {
        component: CNavItem,
        name: 'View/Modify',
        to: '/holiday-view',
        icon: <CIcon icon={cilPencil} style={{ marginRight: "10px" }} />,
        roles: ['admin', 'normal'],
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'Customer',
        to: '/main/reports/customer',
        icon: <CIcon icon={cilUser} style={{ marginRight: "10px" }} />,
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Sales',
        to: '/main/reports/sales',
        icon: <CIcon icon={cilCash} style={{ marginRight: "10px" }} />,
        roles: ['admin'],
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    roles: ['admin'],
    items: [
      {
        component: CNavItem,
        name: 'New Users',
        to: '/add-user',
        icon: <CIcon icon={cilPlus} style={{ marginRight: "10px" }} />,
        roles: ['admin'],
      },
      {
        component: CNavItem,
        name: 'View/Modify',
        to: '/view-user',
        icon: <CIcon icon={cilPencil} style={{ marginRight: "10px" }} />,
        roles: ['admin'],
      }
    ]
  },
  {
    component: CNavItem,
    name: 'Help',
    to: '/main/help',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    roles: ['admin', 'normal'],
  }
]

export default navigation;
