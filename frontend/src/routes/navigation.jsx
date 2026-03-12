import {
  Dashboard as DashboardIcon,
  Calculate as CalculateIcon,
  GroupAdd as GroupAddIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Book as BookIcon,
  NoteAdd as NoteAddIcon,
  Person as PersonIcon,
  AttachMoney as CashIcon,
  ContactPage as ContactPageIcon,
} from '@mui/icons-material';

const navigation = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: <DashboardIcon />,
    roles: ['admin', 'normal'],
  },
  // {
  //   name: 'History',
  //   to: '/history',
  //   icon: <DashboardIcon />,
  //   roles: ['admin', 'normal'],
  // },
  {
    name: 'Flights',
    icon: <ContactPageIcon />,
    roles: ['admin'],
    items: [
      {
        name: 'Add New',
        to: '/flight-details',
        icon: <AddIcon />,
        roles: ['admin'],
      },
      {
        name: 'View Details',
        to: '/flight-view',
        icon: <EditIcon />,
        roles: ['admin'],
      },
      {
        name: 'History',
        to: '/flight-history',
        icon: < EditIcon />,
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Holidays',
    icon: <EditIcon />,
    roles: ['admin'],
    items: [
      {
        name: 'Add New',
        to: '/holiday-details',
        icon: <EditIcon />,
        roles: ['admin'],
      },
      {
        name: 'View Details',
        to: '/holiday-view',
        icon: <EditIcon />,
        roles: ['admin'],
      },
      {
        name: 'History',
        to: '/holiday-history',
        icon: < EditIcon />,
        roles: ['admin'],
      },
    ]
  },
  {
    name: 'Reports',
    icon: <EditIcon />,
    roles: ['admin', 'normal'],
    items: [
      {
        name: 'User Predictions',
        to: '/reports/prediction-report',
        icon: <EditIcon />,
        roles: ['admin', 'normal'],
      },
      {
        name: 'All Predictions',
        to: '/reports/admin-prediction-report',
        icon: <EditIcon />,
        roles: ['admin'],
      }
    ]
  },
  {
    name: 'Users',
    icon: <EditIcon />,
    roles: ['admin'],
    items: [
      {
        name: 'New Users',
        to: '/add-user',
        icon: <EditIcon />,
        roles: ['admin'],
      },
      {
        name: 'View/Modify',
        to: '/view-user',
        icon: <EditIcon />,
        roles: ['admin'],
      }
    ]
  },
  {
    name: 'Admin Dashboard',
    to: '/admin-dashboard',
    icon: <ContactPageIcon />,
    roles: ['admin'],
  },
  {
    name: 'Help',
    to: '/main/help',
    icon: <EditIcon />,
    roles: ['admin', 'normal'],
  }
]

export default navigation;
