# AppHeader Component

The `AppHeader` component is a separated header organism that provides a responsive application header with search functionality, notifications, theme toggle, and user profile management.

## Features

- 🔍 **Search Bar**: Built-in search functionality with keyboard shortcuts
- 🔔 **Notifications**: Notification button with badge support
- 🌓 **Theme Toggle**: Light/dark mode switching
- 👤 **User Profile**: User dropdown with customizable actions
- 📱 **Responsive**: Mobile-first design with collapsible menu
- 🎨 **Customizable**: Flexible props for different use cases

## Usage

### Basic Usage

```jsx
import AppHeader from '../../organisms/AppHeader/AppHeader';

const MyDashboard = () => {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/path/to/avatar.jpg',
    role: 'admin'
  };

  const handleMobileMenuToggle = () => {
    // Handle mobile menu toggle
  };

  const handleUserAction = (action, event) => {
    console.log('User action:', action);
  };

  const handleLogout = () => {
    // Handle logout
  };

  return (
    <AppHeader
      user={user}
      onMobileMenuToggle={handleMobileMenuToggle}
      onUserAction={handleUserAction}
      onLogout={handleLogout}
      brandTitle="CashFlow"
      brandIcon="/logo.svg"
    />
  );
};
```

### With Custom Header Actions

```jsx
import AppHeader from '../../organisms/AppHeader/AppHeader';
import { PlusIcon, CogIcon } from '@heroicons/react/24/outline';

const DashboardWithActions = () => {
  const headerActions = (
    <>
      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <PlusIcon className="w-5 h-5" />
      </button>
      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <CogIcon className="w-5 h-5" />
      </button>
    </>
  );

  return (
    <AppHeader
      user={user}
      onMobileMenuToggle={handleMobileMenuToggle}
      onUserAction={handleUserAction}
      onLogout={handleLogout}
      headerActions={headerActions}
      showSearch={true}
      showNotifications={true}
    />
  );
};
```

### Integration with DashboardTemplate

```jsx
import DashboardTemplate from '../../templates/DashboardTemplate/DashboardTemplate';

const Dashboard = () => {
  // The DashboardTemplate now automatically uses AppHeader
  return (
    <DashboardTemplate
      user={user}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      onUserAction={handleUserAction}
      brandTitle="CashFlow App"
      brandIcon="/logo.svg"
    >
      {/* Your page content */}
    </DashboardTemplate>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `user` | `object` | No | - | User information object |
| `onMobileMenuToggle` | `function` | Yes | - | Function to handle mobile menu toggle |
| `isMobileMenuOpen` | `boolean` | No | `false` | Whether mobile menu is open |
| `headerActions` | `ReactNode` | No | - | Custom actions to display in header |
| `onUserAction` | `function` | No | - | Function to handle user dropdown actions |
| `onLogout` | `function` | Yes | - | Function to handle logout |
| `showSearch` | `boolean` | No | `true` | Whether to show search bar |
| `showNotifications` | `boolean` | No | `true` | Whether to show notifications |
| `brandTitle` | `string` | No | - | Brand title for mobile view |
| `brandIcon` | `string` | No | - | Brand icon URL |
| `className` | `string` | No | `""` | Additional CSS classes |

## User Object Structure

```typescript
interface User {
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  roles?: string[];
}
```

## Search Functionality

The search bar includes:
- Placeholder text: "Search or type command..."
- Keyboard shortcut indicator (⌘K)
- Form submission handling
- Responsive design (hidden on mobile)

## Styling

The component uses Tailwind CSS classes and supports:
- Light and dark themes
- Responsive breakpoints
- Hover and focus states
- Smooth transitions
- Accessibility features

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support
