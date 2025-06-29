# Store Folder - State Management

The `store` folder contains global state management logic using Zustand, a lightweight state management library for React.

## Purpose of the Store Folder

The store folder is used for:

1. **Global State Management**: Managing application-wide state that needs to be shared across multiple components
2. **Data Persistence**: Storing data that should persist across page refreshes (like user authentication)
3. **Business Logic**: Centralizing complex state operations and calculations
4. **Performance**: Avoiding prop drilling and unnecessary re-renders

## Store Structure

```
store/
├── authStore.js          # Authentication state
├── transactionStore.js   # Transaction data and operations
├── uiStore.js           # UI state (modals, sidebar, theme)
└── index.js             # Store exports
```

## Store Files Explained

### 1. `authStore.js` - Authentication State
- **Purpose**: Manages user authentication state
- **State**: user, token, isAuthenticated, loading, error
- **Actions**: setUser, setToken, clearAuth, etc.
- **Persistence**: Uses Zustand persist middleware to save auth state to localStorage

### 2. `transactionStore.js` - Transaction Data
- **Purpose**: Manages financial transaction data and operations
- **State**: transactions, categories, summary, filters
- **Actions**: CRUD operations for transactions, filtering, calculations
- **Computed Values**: getTotalIncome, getTotalExpenses, getNetIncome

### 3. `uiStore.js` - UI State
- **Purpose**: Manages UI-related state
- **State**: sidebar, theme, notifications, modals, current page
- **Actions**: toggle sidebar, manage modals, handle notifications

## When to Use Stores vs. Component State

### Use Stores When:
- State needs to be shared across multiple components
- State should persist across page refreshes
- Complex state logic that multiple components need
- Performance optimization (avoiding prop drilling)

### Use Component State When:
- State is only used within a single component
- Simple, temporary state (form inputs, toggles)
- State doesn't need to persist

## Benefits of This Approach

1. **Separation of Concerns**: Each store handles a specific domain
2. **Reusability**: Store logic can be used across different components
3. **Testability**: Stores can be tested independently
4. **Performance**: Selective subscriptions prevent unnecessary re-renders
5. **Developer Experience**: Clear structure and easy debugging

## Usage Examples

### Using Auth Store
```javascript
import { useAuthStore } from '../store';

function MyComponent() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Using Transaction Store
```javascript
import { useTransactionStore } from '../store';

function Dashboard() {
  const { 
    transactions, 
    getTotalIncome, 
    getTotalExpenses,
    addTransaction 
  } = useTransactionStore();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  
  return (
    <div>
      <p>Income: ${totalIncome}</p>
      <p>Expenses: ${totalExpenses}</p>
    </div>
  );
}
```

### Using UI Store
```javascript
import { useUIStore } from '../store';

function Header() {
  const { 
    sidebarOpen, 
    toggleSidebar, 
    openModal,
    notifications 
  } = useUIStore();
  
  return (
    <header>
      <button onClick={toggleSidebar}>
        {sidebarOpen ? 'Close' : 'Open'} Sidebar
      </button>
      <div>Notifications: {notifications.length}</div>
    </header>
  );
}
```

## Alternative State Management Solutions

While we're using Zustand, you could also use:

1. **Redux Toolkit**: More complex but powerful, good for very large applications
2. **React Context**: Built-in React solution, good for simpler state sharing
3. **Jotai**: Atomic state management, good for complex state relationships
4. **Valtio**: Proxy-based state management, good for mutable state patterns

## Best Practices

1. **Keep stores focused**: Each store should handle a specific domain
2. **Use computed values**: Calculate derived state in the store rather than components
3. **Minimize subscriptions**: Only subscribe to the parts of state you need
4. **Handle errors**: Include error states and error handling in your stores
5. **Use persistence wisely**: Only persist data that should survive page refreshes

The store folder provides a centralized, organized way to manage application state while keeping components clean and focused on rendering.
