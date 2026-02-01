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
  {
    name: 'Bill Generator',
    to: '/bill-generator',
    icon: <DashboardIcon />,
    roles: ['admin', 'normal'],
  },
  {
    name: 'Flights',
    icon: <ContactPageIcon />,
    roles: ['admin', 'normal'],
    items: [
      {
        name: 'Add New',
        to: '/flight-details',
        icon: <AddIcon />,
        roles: ['admin', 'normal'],
      },
      {
        name: 'View/Modify',
        to: '/flight-view',
        icon: <EditIcon />,
        roles: ['admin', 'normal'],
      },
      {
        name: 'History',
        to: '/flight-history',
        icon: < EditIcon />,
        roles: ['admin', 'normal'],
      },
    ],
  },
  {
    name: 'Holidays',
    icon: <EditIcon />,
    roles: ['admin', 'normal'],
    items: [
      {
        name: 'Add New',
        to: '/holiday-details',
        icon: <EditIcon />,
        roles: ['admin', 'normal'],
      },
      {
        name: 'View/Modify',
        to: '/holiday-view',
        icon: <EditIcon />,
        roles: ['admin', 'normal'],
      }
    ]
  },
  {
    name: 'Reports',
    icon: <EditIcon />,
    roles: ['admin'],
    items: [
      {
        name: 'Customer',
        to: '/reports/customer',
        icon: <EditIcon />,
        roles: ['admin'],
      },
      {
        name: 'Sales',
        to: '/reports/sales',
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
    name: 'Help',
    to: '/main/help',
    icon: <EditIcon />,
    roles: ['admin', 'normal'],
  }
]

export default navigation;
