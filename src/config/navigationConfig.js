import { 
  HomeIcon, 
  TagIcon, 
  ChartBarIcon, 
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BanknotesIcon,
  PlusIcon,
  CreditCardIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

/**
 * Default Navigation Configuration
 * Customize this based on your application needs
 */
export const defaultNavigationGroups = [
  {
    id: 'main',
    title: 'Main',
    items: [
      {
        id: 'dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        label: 'Dashboard',
        activePaths: ['/dashboard', '/']
      },
      {
        id: 'customers',
        href: '/customers',
        icon: UserGroupIcon,
        label: 'Customers',
        activePaths: ['/customers']
      },
      {
        id: 'suppliers',
        href: '/suppliers',
        icon: BuildingStorefrontIcon,
        label: 'Suppliers',
        activePaths: ['/suppliers']
      },
      {
        id: 'checks',
        href: '/checks',
        icon: BanknotesIcon,
        label: 'Checks',
        activePaths: ['/checks']
      },
    ]
  },
  // {
  //   id: 'analytics',
  //   title: 'Analytics',
  //   items: [
  //     {
  //       id: 'reports',
  //       href: '/reports',
  //       icon: DocumentTextIcon,
  //       label: 'Reports',
  //       activePaths: ['/reports']
  //     },
  //     {
  //       id: 'insights',
  //       href: '/insights',
  //       icon: ChartBarIcon,
  //       label: 'Insights',
  //       activePaths: ['/insights']
  //     }
  //   ]
  // },
  // {
  //   id: 'management',
  //   title: 'Management',
  //   requiresRole: ['admin', 'manager'],
  //   items: [
  //     {
  //       id: 'users',
  //       href: '/users',
  //       icon: UserGroupIcon,
  //       label: 'Users',
  //       activePaths: ['/users'],
  //       requiresRole: ['admin']
  //     },
  //     {
  //       id: 'notifications',
  //       href: '/notifications',
  //       icon: BellIcon,
  //       label: 'Notifications',
  //       activePaths: ['/notifications']
  //     }
  //   ]
  // },
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   items: [
  //     {
  //       id: 'preferences',
  //       href: '/settings',
  //       icon: CogIcon,
  //       label: 'Settings',
  //       activePaths: ['/settings']
  //     }
  //   ]
  // }
];

/**
 * Default User Dropdown Items
 */
export const defaultUserDropdownItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircleIcon
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: CogIcon
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: ArrowRightOnRectangleIcon
  }
];

/**
 * Quick Action Items (can be used in header or fab)
 */
export const quickActionItems = [
  {
    id: 'add-transaction',
    label: 'Add Transaction',
    icon: PlusIcon,
    href: '/transactions'
  },
  {
    id: 'add-customer',
    label: 'Add Customer',
    icon: UserGroupIcon,
    href: '/customers'
  },
  {
    id: 'add-supplier',
    label: 'Add Supplier',
    icon: BuildingStorefrontIcon,
    href: '/suppliers'
  },
  {
    id: 'add-category',
    label: 'Add Category',
    icon: TagIcon,
    href: '/categories'
  }
];

export default {
  defaultNavigationGroups,
  defaultUserDropdownItems,
  quickActionItems
};
