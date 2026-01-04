# 📱 TomatoTasks Mobile App

React Native mobile app for TomatoTasks using Expo. Works seamlessly with the existing backend API to provide iOS, Android, and web support from a single codebase.

## 🏗️ Project Structure

```
src/
├── screens/                 # Screen components (pages)
│   ├── auth/               # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── main/               # Main app screens
│   │   ├── DashboardScreen.tsx
│   │   ├── GardenScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── tasks/              # Task management screens
│       ├── TaskListScreen.tsx
│       ├── TaskDetailScreen.tsx
│       ├── CreateTaskScreen.tsx
│       └── EditTaskScreen.tsx
│
├── components/             # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── garden/             # Garden/gamification components
│   ├── tasks/              # Task-related components
│   ├── common/             # Shared UI components
│   └── animations/         # Animation components
│
├── services/               # API & business logic
│   ├── api/
│   │   ├── axiosConfig.ts  # HTTP client configuration
│   │   └── endpoints.ts    # API endpoint constants
│   ├── auth.service.ts     # Authentication logic
│   ├── task.service.ts     # Task CRUD operations
│   ├── garden.service.ts   # Garden/punishment logic
│   └── storage.service.ts  # AsyncStorage wrapper
│
├── context/                # React Context for state management
│   ├── AuthContext.tsx     # Auth state & methods
│   ├── TaskContext.tsx     # Tasks state & methods
│   └── GardenContext.tsx   # Garden state & methods
│
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useGarden.ts
│   └── useApiCall.ts       # Generic API call hook
│
├── types/                  # TypeScript interfaces
│   ├── User.ts
│   ├── Task.ts
│   ├── Punishment.ts
│   └── ApiResponse.ts
│
├── styles/                 # Design system & theming
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
│
├── utils/                  # Utility functions
│   ├── validation.ts       # Form validation
│   ├── formatters.ts       # Date/time formatters
│   └── constants.ts        # App constants
│
├── navigation/             # Navigation setup
│   ├── types.ts            # Navigation type definitions
│   ├── RootNavigator.tsx   # Main navigation container
│   ├── AuthNavigator.tsx   # Auth stack navigator
│   └── AppNavigator.tsx    # App stack & bottom tab navigator
│
└── assets/                 # Images, icons, animations
    ├── images/
    └── icons/

__tests__/                  # Unit & integration tests
├── services/
├── components/
└── hooks/
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Navigate to mobile directory
cd mobile/tomato-mobile

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your backend API URL
# REACT_APP_API_BASE_URL=http://your-backend-url:8080
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## 🔗 API Integration

The mobile app connects to the same backend as the web app using the same REST API endpoints:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Tasks**: `/api/tasks` (CRUD operations)
- **Garden**: `/api/garden/stats`, `/api/garden/punishments`
- **Tomatoes**: `/api/tomatoes/current`, `/api/tomatoes/history`
- **Punishments**: `/api/punishments`

### Shared Data

- **JWT Authentication**: Same token-based system as web app
- **Database**: Shared MySQL database for all clients
- **User Accounts**: One account works across web, iOS, and Android

## 🏗️ Architecture

### State Management
- **React Context** for global state (Auth, Tasks, Garden)
- **Custom Hooks** for easy state access throughout the app
- **AsyncStorage** for persistent local data (tokens, user info)

### API Calls
- **Axios** for HTTP requests with automatic JWT token injection
- **Interceptors** for error handling and token refresh
- **Generic API hook** for consistent data fetching patterns

### Navigation
- **React Navigation** for stack and bottom tab navigation
- **Type-safe navigation** with TypeScript navigation params
- **Protected routes** for authenticated screens

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.30",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "~7.0",
  "@react-navigation/bottom-tabs": "~7.0",
  "axios": "^1.13.2",
  "@react-native-async-storage/async-storage": "^1.23.1",
  "date-fns": "^3.0.0"
}
```

## ✨ Features to Implement

- [ ] Login & Register screens with validation
- [ ] Splash screen with authentication bootstrap
- [ ] Garden display with animated tomato plant
- [ ] Task list with create/edit/delete functionality
- [ ] Punishment visualization (fog, weeds, wilted leaves)
- [ ] Tomato gain animations
- [ ] Bottom tab navigation (Garden, Tasks, Profile)
- [ ] Push notifications for task reminders
- [ ] Offline support (local task caching)
- [ ] Dark mode support

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📱 Deployment

### iOS
```bash
npm run build:ios
# Requires Apple Developer account
```

### Android
```bash
npm run build:android
# Requires Google Play Developer account
```

### Web
```bash
npm run build
# Deploy to any static hosting (Vercel, Netlify, etc.)
```

## 🔐 Security

- JWT tokens stored securely in AsyncStorage
- Automatic token refresh on 401 responses
- HTTPS required for production API calls
- Environment variables for sensitive data

## 📝 Environment Variables

Create a `.env` file with the following:

```
REACT_APP_API_BASE_URL=http://your-backend-url:8080
REACT_APP_ENV=development
```

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

Same as parent TomatoTasks project
