# Cashflow Web - Folder Structure

This project follows atomic design principles and clean architecture patterns for better maintainability and scalability.

## Folder Structure

```
src/
├── components/          # UI Components (Atomic Design)
│   ├── atoms/          # Basic building blocks
│   │   ├── Button/     # Button component
│   │   ├── Input/      # Input component
│   │   └── index.js    # Barrel exports
│   ├── molecules/      # Combinations of atoms
│   │   ├── LoginForm/  # Login form component
│   │   └── index.js    # Barrel exports
│   ├── organisms/      # Complex UI sections
│   ├── templates/      # Page layouts
│   └── index.js        # Main component exports
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login page
│   ├── DashboardPage.jsx # Dashboard page
│   └── index.js        # Page exports
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   ├── useCashflow.js  # Cashflow data hook
│   └── index.js        # Hook exports
├── services/           # Business logic & API
│   ├── api/           # API layer
│   │   ├── client.js   # HTTP client
│   │   ├── authService.js # Auth API calls
│   │   ├── cashflowService.js # Cashflow API calls
│   │   └── index.js    # API exports
│   └── index.js        # Service exports
├── utils/              # Utility functions
│   ├── currency.js     # Currency formatting
│   ├── date.js         # Date utilities
│   ├── validation.js   # Form validation
│   └── index.js        # Utility exports
├── constants/          # Application constants
│   └── index.js        # Constants definition
├── types/              # TypeScript type definitions
│   └── index.d.ts      # Type definitions
├── store/              # State management (future)
├── assets/             # Static assets
│   ├── images/         # Images
│   └── icons/          # Icons
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── config.js           # Configuration
```

## Atomic Design Principles

### Atoms
- Basic HTML elements (buttons, inputs, labels)
- Cannot be broken down further
- Highly reusable across the application

### Molecules  
- Groups of atoms functioning together
- Simple combinations like search forms, navigation items
- Still relatively simple and reusable

### Organisms
- Complex UI components made of groups of molecules and/or atoms
- Header with navigation, sidebar, card lists
- More specific to sections of the interface

### Templates
- Page-level layouts that place components into a layout
- Define the content structure and organize organisms
- Focus on content structure rather than final content

### Pages
- Specific instances of templates with real content
- What users actually see and interact with

## Key Benefits

1. **Separation of Concerns**: Each folder has a specific responsibility
2. **Reusability**: Components are designed to be reused across the application
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Scalability**: Structure supports growth and additional features
5. **Testing**: Isolated components are easier to test
6. **Team Collaboration**: Clear structure helps team members understand the codebase

## Usage Guidelines

### Components
- Keep components pure and focused on a single responsibility
- Use PropTypes for type checking
- Export components using barrel exports (index.js files)

### Services
- All API calls should go through the service layer
- Services should handle error cases and data transformation
- Keep services stateless

### Hooks
- Custom hooks should encapsulate related stateful logic
- Follow the "use" naming convention
- Keep hooks focused on a single concern

### Utils
- Pure functions only
- No side effects
- Highly testable utility functions

### Constants
- All magic numbers and strings should be defined as constants
- Group related constants together

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Adding New Components

1. Create a new folder in the appropriate atomic level
2. Create the component file (e.g., `ComponentName.jsx`)
3. Create an `index.js` file for barrel exports
4. Add the export to the parent level's `index.js`
5. Write tests for the component (when test structure is added)

## API Integration

The API layer is designed to be easily configurable:

1. Update `src/services/api/client.js` with your API base URL
2. Add new service files for different API endpoints
3. Use the services in your custom hooks
4. Handle loading states and errors in components

This structure provides a solid foundation for building a scalable React application with proper separation of concerns and maintainable code organization.
