# ERP System Frontend

A professional React + TypeScript frontend for the ERP system with authentication, client management, product catalog, and order processing.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router v6** for routing
- **Zustand** for state management
- **Tailwind CSS** with custom design system
- **Axios** for API communication
- **React Hook Form + Zod** for form handling and validation

## Design System

- **Primary Color**: Amber (#d97706) - Professional and trustworthy
- **Typography**: Playfair Display (headings) + Source Sans Pro (body)
- **Layout**: Clean, card-based design with responsive sidebar navigation

## Features

- ✅ Professional design system with amber/golden color palette
- ✅ Responsive layout with sidebar navigation
- ✅ Authentication state management with token refresh
- ✅ Protected routes and automatic redirects
- ✅ Comprehensive API integration with error handling
- ✅ Client management with detailed forms and file uploads
- ✅ Product catalog with filtering, sorting, and grid/list views
- ✅ Order management with multi-product selection and PDF generation
- ✅ Global error handling with retry mechanisms
- ✅ Toast notifications for user feedback
- ✅ Network status monitoring
- ✅ Error boundaries for graceful error recovery
- ✅ TypeScript for type safety

## API Integration & Error Handling

The frontend includes comprehensive API integration with:

### Enhanced Error Handling
- **Automatic retry logic** for network errors and server failures
- **Token refresh** for expired authentication
- **Global error boundaries** to catch and handle React errors
- **User-friendly error messages** with specific handling for different error types
- **Network status monitoring** with offline/online notifications

### Toast Notifications
- **Success notifications** for completed actions
- **Error notifications** with detailed messages and retry options
- **Warning notifications** for network issues
- **Info notifications** for general updates

### Request/Response Interceptors
- **Automatic authentication** token attachment
- **Request/response logging** in development mode
- **Request ID tracking** for debugging
- **Timeout handling** with configurable timeouts

### Retry Mechanisms
- **Configurable retry logic** for failed requests
- **Exponential backoff** for retry delays
- **Conditional retries** based on error type
- **Maximum retry limits** to prevent infinite loops

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Set up environment**:
   \`\`\`bash
   cp .env.example .env
   # Update VITE_API_BASE_URL if needed
   \`\`\`

3. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Make sure backend is running**:
   The frontend expects the backend API to be running on `http://localhost:3000`

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, Toast)
│   ├── clients/        # Client-specific components
│   ├── products/       # Product-specific components
│   ├── orders/         # Order-specific components
│   ├── Layout.tsx      # Main app layout with sidebar
│   ├── ProtectedRoute.tsx
│   └── ErrorBoundary.tsx
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── DashboardPage.tsx
│   ├── ClientsPage.tsx
│   ├── ProductsPage.tsx
│   └── OrdersPage.tsx
├── services/           # API services
│   ├── api.ts          # Enhanced Axios configuration
│   ├── authService.ts  # Authentication API calls
│   ├── clientService.ts # Client management API calls
│   ├── productService.ts # Product catalog API calls
│   └── orderService.ts # Order management API calls
├── store/              # Zustand stores
│   └── authStore.ts    # Authentication state
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useApiError.ts  # Error handling hook
│   └── useNetworkStatus.ts # Network monitoring hook
├── types/              # TypeScript type definitions
│   └── index.ts
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities
│   └── validations.ts  # Zod validation schemas
└── App.tsx             # Main app component with providers
\`\`\`

## Error Handling

The application includes multiple layers of error handling:

### 1. API Level
- Automatic retry for network failures
- Token refresh for authentication errors
- Detailed error parsing and user-friendly messages

### 2. Component Level
- Error boundaries to catch React errors
- Graceful fallbacks for failed components
- Retry mechanisms for failed operations

### 3. User Experience
- Toast notifications for all user actions
- Loading states for async operations
- Offline/online status indicators
- Clear error messages with actionable advice

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend automatically proxies API requests to the backend:
- `/api/*` routes are proxied to `http://localhost:3000/api/*`
- `/auth/*` routes are proxied to `http://localhost:3000/auth/*`

### Authentication Flow
1. User logs in with credentials
2. Backend returns access token and refresh token
3. Access token is attached to all API requests
4. When access token expires, refresh token is used automatically
5. If refresh fails, user is redirected to login

### Error Recovery
- Network errors trigger automatic retries
- Server errors show user-friendly messages
- Authentication errors redirect to login
- Validation errors highlight specific fields

## Development Tips

1. **Error Testing**: Use browser dev tools to simulate network failures
2. **Token Expiry**: Manually expire tokens to test refresh flow
3. **Offline Mode**: Use dev tools to simulate offline conditions
4. **API Monitoring**: Check console for detailed request/response logs
5. **Error Boundaries**: Throw errors in components to test error boundaries

The application is designed to be resilient and provide excellent user experience even when things go wrong.
