# IoT Monitor - Expo Mobile Application

Aplikasi mobile monitoring perangkat IoT secara realtime berbasis **Expo (React Native)** dengan Clean Architecture.

## Tech Stack

- **Framework:** Expo SDK 57 + React Native 0.86
- **Language:** TypeScript (strict mode)
- **Routing:** Expo Router (file-based routing)
- **UI Library:** React Native Paper (Material Design 3)
- **State Management:** Zustand
- **Server State:** TanStack Query (React Query v5)
- **Forms:** React Hook Form + Zod Validation
- **HTTP Client:** Axios (with JWT interceptor)
- **Charts:** react-native-svg (custom chart component)
- **Storage:** AsyncStorage
- **File System:** expo-file-system
- **Sharing:** expo-sharing
- **Notifications:** expo-notifications

## Struktur Project

```
iot-monitor/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── _layout.tsx         # Root layout (query client, theme provider)
│   │   ├── index.tsx           # Entry point (auth redirect)
│   │   ├── (auth)/             # Auth group
│   │   │   ├── _layout.tsx     # Auth layout
│   │   │   └── login.tsx       # Login screen
│   │   ├── (tabs)/             # Main tab navigation
│   │   │   ├── _layout.tsx     # Tab bar configuration
│   │   │   ├── dashboard.tsx   # Dashboard monitoring
│   │   │   ├── history.tsx     # Riwayat monitoring
│   │   │   ├── device.tsx      # Status perangkat
│   │   │   ├── profile.tsx     # Profil user
│   │   │   └── settings.tsx    # Pengaturan aplikasi
│   │   └── monitoring/
│   │       └── [id].tsx        # Detail monitoring (dynamic route)
│   ├── components/             # Reusable UI components
│   │   ├── MonitoringCard.tsx  # Card monitoring parameter
│   │   ├── ChartCard.tsx       # Card wrapper untuk grafik
│   │   ├── ChartComponent.tsx  # SVG chart component
│   │   ├── StatusBadge.tsx     # Status online/offline badge
│   │   ├── FilterBar.tsx       # Search + filter component
│   │   ├── ExportButton.tsx    # Tombol export Excel
│   │   ├── LoadingSkeleton.tsx # Skeleton loading animation
│   │   ├── EmptyState.tsx      # Empty state placeholder
│   │   └── ErrorState.tsx      # Error state with retry
│   ├── services/               # API service layer
│   │   ├── api.ts              # Axios instance + interceptors
│   │   ├── auth.ts             # Auth API (login, logout, profile)
│   │   ├── monitoring.ts       # Monitoring API (dashboard, history, chart)
│   │   ├── device.ts           # Device status API
│   │   ├── exportService.ts    # Excel export service
│   │   └── notifications.ts    # Push notification service
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useMonitoring.ts    # Monitoring data hooks (React Query)
│   │   ├── useDevice.ts        # Device status hook
│   │   ├── useExport.ts        # Export Excel hook
│   │   └── useNotifications.ts # Notifications hook
│   ├── store/                  # State management
│   │   ├── auth.ts             # Auth store (Zustand)
│   │   └── settings.ts         # Settings store (Zustand)
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # All types and interfaces
│   ├── constants/              # App constants
│   │   ├── api.ts              # API endpoints, cache keys, storage keys
│   │   └── theme.ts            # Theme colors, spacing, typography
│   ├── utils/                  # Utility functions
│   │   ├── format.ts           # Data formatting functions
│   │   └── storage.ts          # AsyncStorage wrapper
│   └── assets/                 # Static assets
├── .env                        # Environment variables
├── .env.example                # Example env file
├── app.json                    # Expo configuration
├── index.ts                    # App entry point
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Cara Menjalankan

### Prerequisites

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (di smartphone) atau emulator

### Instalasi

```bash
cd iot-monitor

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env dengan URL backend yang sesuai
```

### Menjalankan Aplikasi

```bash
# Development
npm start

# Atau langsung ke platform tertentu:
npm run android
npm run ios
npm run web
```

## Integrasi Backend

### Konfigurasi API

Edit file `.env`:

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com/v1
```

### Endpoint yang Dibutuhkan

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh JWT token |
| GET | `/profile` | Get user profile |
| PUT | `/profile/change-password` | Ubah password |
| GET | `/dashboard` | Dashboard monitoring data |
| GET | `/monitoring/latest` | Data monitoring terbaru |
| GET | `/monitoring/history` | Riwayat monitoring (paginated) |
| GET | `/monitoring/chart` | Data grafik monitoring |
| GET | `/monitoring/:id` | Detail monitoring |
| GET | `/device/status` | Status perangkat |
| GET | `/export/excel` | Download file Excel |

### Contoh Request & Response API

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### Dashboard

```http
GET /dashboard
Authorization: Bearer <token>
```

**Response:**

```json
{
  "latest": {
    "id": "1",
    "voltageAC": 220.5,
    "currentAC": 5.2,
    "voltageDC": 12.1,
    "temperature": 32.5,
    "humidity": 65.2,
    "deviceStatus": "online",
    "timestamp": "2026-07-08T10:30:00Z"
  },
  "chart": {
    "voltageAC": [
      { "timestamp": "2026-07-08T09:30:00Z", "value": 219.8 },
      { "timestamp": "2026-07-08T10:00:00Z", "value": 220.1 },
      { "timestamp": "2026-07-08T10:30:00Z", "value": 220.5 }
    ],
    "currentAC": [],
    "voltageDC": [],
    "temperature": [],
    "humidity": []
  },
  "deviceStatus": "online",
  "lastUpdate": "2026-07-08T10:30:00Z"
}
```

#### Riwayat Monitoring (Paginated)

```http
GET /monitoring/history?page=1&limit=20&sortBy=timestamp&sortOrder=desc&search=&filter=day
Authorization: Bearer <token>
```

**Response:**

```json
{
  "data": [
    {
      "id": "1",
      "voltageAC": 220.5,
      "currentAC": 5.2,
      "voltageDC": 12.1,
      "temperature": 32.5,
      "humidity": 65.2,
      "deviceStatus": "online",
      "timestamp": "2026-07-08T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

#### Chart Data

```http
GET /monitoring/chart?range=1h
Authorization: Bearer <token>
```

**Response:**

```json
{
  "voltageAC": [
    { "timestamp": "2026-07-08T09:30:00Z", "value": 219.8 },
    { "timestamp": "2026-07-08T10:00:00Z", "value": 220.1 },
    { "timestamp": "2026-07-08T10:30:00Z", "value": 220.5 }
  ],
  "currentAC": [],
  "voltageDC": [],
  "temperature": [],
  "humidity": []
}
```

#### Export Excel

```http
GET /export/excel?startDate=2026-07-01T00:00:00Z&endDate=2026-07-08T23:59:59Z
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:** Binary file (.xlsx)

### Type Definitions

```typescript
// User & Auth
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// Monitoring
interface MonitoringData {
  id: string;
  voltageAC: number;
  currentAC: number;
  voltageDC: number;
  temperature: number;
  humidity: number;
  deviceStatus: 'online' | 'offline' | 'warning';
  timestamp: string;
  notes?: string;
}

interface DashboardData {
  latest: MonitoringData;
  chart: ChartData;
  deviceStatus: 'online' | 'offline' | 'warning';
  lastUpdate: string;
}

interface ChartDataPoint {
  timestamp: string;
  value: number;
}

interface ChartData {
  voltageAC: ChartDataPoint[];
  currentAC: ChartDataPoint[];
  voltageDC: ChartDataPoint[];
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
}

// History
interface HistoryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: string;
  endDate?: string;
  filter?: 'day' | 'week' | 'month' | 'custom';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Device
interface DeviceInfo {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  location?: string;
}
```

## Fitur

- **Autentikasi JWT** - Login, logout, auto-login, refresh token
- **Dashboard Realtime** - Monitoring 5 parameter + status device
- **Grafik Interaktif** - Pilih rentang waktu (1j, 6j, 12j, 24j, 7h, 30h)
- **Riwayat Monitoring** - List data dengan pagination, search, filter, sort
- **Detail Monitoring** - Lihat detail lengkap setiap data
- **Status Device** - Informasi lengkap perangkat IoT
- **Export Excel** - Download data dalam format .xlsx + share
- **Dark Mode** - Toggle tema gelap/terang
- **Notifikasi** - Push notification untuk alarm dan peringatan
- **Auto Refresh** - Update data otomatis dengan interval yang bisa diatur
- **Pull to Refresh** - Update manual dengan swipe
- **Loading Skeleton** - Animasi loading yang halus
- **Error Handling** - Token expired, no internet, server error, dll

## Best Practices

1. **Clean Architecture** - Pemisahan concern antara komponen, service, hook, dan store
2. **TypeScript Strict** - type safety penuh di seluruh kode
3. **JWT Security** - Token disimpan di AsyncStorage, auto-refresh, auto-logout
4. **Performance** - React Query caching, lazy loading, pagination, memoization
5. **Error Handling** - Global error interceptor, retry mechanism, user-friendly error states
6. **Reusable Components** - Components dirancang modular dan reusable
7. **Consistent Styling** - Design system dengan Material Design 3
