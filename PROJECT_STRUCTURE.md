# Project Structure

This Farcaster Mini App has been organized with a clean, modular structure following React best practices.

## 📁 Directory Structure

```
src/
├── components/          # React components
│   ├── ConnectMenu.tsx  # Wallet connection UI
│   ├── SignButton.tsx   # Message signing component
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   ├── useMiniApp.ts    # Mini App detection logic
│   └── index.ts         # Hook exports
├── lib/                 # Utility functions
│   └── index.ts         # Utility exports
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── wagmi.ts             # Wagmi configuration
├── index.css            # Global styles
└── vite-env.d.ts        # TypeScript definitions
```

## 🎯 Key Features

### Components
- **ConnectMenu**: Handles wallet connection state and UI
- **SignButton**: Provides message signing functionality with error handling
- **Modular Design**: Each component is self-contained with its own styling classes

### Hooks
- **useMiniApp**: Custom hook that detects if the app is running in a Farcaster Mini App environment
- **Async Detection**: Properly handles the async nature of `sdk.isInMiniApp()`
- **Error Handling**: Includes try/catch for robust error management

### Styling
- **CSS Classes**: Semantic class names following BEM-like conventions
- **Responsive Design**: Mobile-first approach with media queries
- **Modern UI**: Clean, minimal design with proper spacing and typography
- **Dark Theme**: Professional dark theme with accent colors

## 🚀 Development Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across the application
3. **Maintainability**: Clear file structure makes it easy to find and modify code
4. **Testing**: Isolated components are easier to test
5. **Scalability**: Easy to add new components and features

## 📋 Component Props & APIs

### ConnectMenu
- Uses `useAccount()` and `useConnect()` from wagmi
- Automatically renders connection state
- Includes SignButton when connected

### SignButton
- Uses `useSignMessage()` from wagmi
- Handles loading states and errors
- Displays signature results

### useMiniApp Hook
Returns:
- `isMiniApp`: boolean | null - Whether app is in Mini App environment
- `isLoading`: boolean - Whether detection is in progress

## 🎨 Styling System

- **CSS Custom Properties**: Uses CSS variables for consistent theming
- **Component Classes**: Each component has its own CSS class namespace
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: Proper focus states and semantic HTML

## 🔧 Adding New Components

1. Create component file in `src/components/`
2. Add export to `src/components/index.ts`
3. Import and use in other components
4. Add corresponding styles to `src/index.css`

## 🔗 Adding New Hooks

1. Create hook file in `src/hooks/`
2. Add export to `src/hooks/index.ts`
3. Import and use in components

This structure provides a solid foundation for building and scaling your Farcaster Mini App. 