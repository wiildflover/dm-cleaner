# Architecture Documentation

Technical architecture and design decisions for Wildflover DM Cleaner.

## Overview

Wildflover DM Cleaner is built using Electron, combining a Node.js backend with a React frontend. The application follows a modular architecture with clear separation of concerns.

## Technology Stack

### Core Technologies

- **Electron 27**: Desktop application framework
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

### Build Tools

- **Electron Vite**: Electron-specific Vite configuration
- **Electron Builder**: Application packaging and distribution
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Project Structure

```
dm-cleaner/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # Application entry point
│   │   └── token-discovery.ts  # Token discovery logic
│   │
│   ├── preload/                # Preload scripts
│   │   └── index.ts            # IPC bridge
│   │
│   └── renderer/               # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── modals/    # Modal components
│       │   │   ├── DMListView.tsx
│       │   │   ├── LogsView.tsx
│       │   │   ├── SettingsView.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Titlebar.tsx
│       │   │
│       │   ├── assets/        # Static assets
│       │   │   ├── badges/    # Discord badges
│       │   │   ├── app_bg.jpg
│       │   │   ├── icon.png
│       │   │   └── main.css
│       │   │
│       │   ├── constants/     # Constants and configs
│       │   │   └── badges.ts
│       │   │
│       │   ├── types/         # TypeScript definitions
│       │   │   └── index.ts
│       │   │
│       │   ├── utils/         # Utility functions
│       │   │   └── badges.ts
│       │   │
│       │   ├── App.tsx        # Main app component
│       │   ├── Dashboard.tsx  # Dashboard component
│       │   └── main.tsx       # React entry point
│       │
│       └── index.html         # HTML template
│
├── build/                     # Build resources
├── dist/                      # Production builds
├── badges/                    # Badge assets
├── electron.vite.config.ts   # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project metadata
```

## Architecture Layers

### 1. Main Process (Electron)

**Location:** `src/main/`

**Responsibilities:**
- Application lifecycle management
- Window creation and management
- IPC communication handling
- Token discovery from local storage
- System integration

**Key Components:**

```typescript
// Application Configuration
const APP_CONFIG = {
    name: 'Wildflover DM Cleaner',
    version: '1.0.0',
    window: {
        width: 1200,
        height: 700,
        minWidth: 1100,
        minHeight: 650
    }
}

// Professional Logger
const Logger = {
    info: (tag: string, message: string) => {},
    success: (tag: string, message: string) => {},
    warn: (tag: string, message: string) => {},
    error: (tag: string, message: string) => {}
}
```

### 2. Preload Scripts

**Location:** `src/preload/`

**Responsibilities:**
- Bridge between main and renderer processes
- Expose safe APIs to renderer
- Context isolation implementation

**API Surface:**

```typescript
interface ElectronAPI {
    discoverTokens: () => Promise<string[]>
    minimize: () => void
    maximize: () => void
    close: () => void
    resize: (width: number, height: number) => void
}
```

### 3. Renderer Process (React)

**Location:** `src/renderer/`

**Responsibilities:**
- User interface rendering
- User interaction handling
- State management
- API communication

**Component Hierarchy:**

```
App
├── Titlebar
├── BrandingSection
├── AccountPickerSection
└── ManualLoginModal

Dashboard
├── Titlebar
├── Sidebar
├── Main Content
│   ├── DMListView
│   ├── LogsView
│   └── SettingsView
└── Modals
    ├── SummaryModal
    ├── ChannelListModal
    ├── ConfirmModal
    ├── FriendsModal
    └── ChatModal
```

## Data Flow

### Token Discovery Flow

```
1. User launches application
2. Main process scans Discord directories
3. Tokens extracted from LevelDB/localStorage
4. Tokens validated via Discord API
5. User profiles fetched and displayed
6. User selects account
```

### Message Deletion Flow

```
1. User selects DM channels
2. Confirmation modal displayed
3. Cleaning process initiated
4. For each channel:
   a. Fetch messages in batches
   b. Filter user's messages
   c. Delete messages sequentially
   d. Handle rate limits
   e. Update progress
5. Display summary statistics
```

## State Management

### React State

The application uses React hooks for state management:

```typescript
// Account state
const [accounts, setAccounts] = useState<DiscordAccount[]>([])
const [selectedAccount, setSelectedAccount] = useState<DiscordAccount | null>(null)

// UI state
const [loading, setLoading] = useState(true)
const [viewMode, setViewMode] = useState<'list' | 'logs'>('list')

// Cleaning state
const [cleaning, setCleaning] = useState(false)
const [selectedDMs, setSelectedDMs] = useState<Set<string>>(new Set())
const [cleaningProgress, setCleaningProgress] = useState<CleaningProgress>({
    current: 0,
    total: 0,
    currentChannel: ''
})

// Settings state
const [appSettings, setAppSettings] = useState<AppSettings>({
    deleteDelay: 600,
    batchSize: 100,
    autoRefresh: true,
    autoScroll: true,
    deleteAttachments: true,
    stopOnError: false
})
```

### State Persistence

- Settings stored in localStorage
- Tokens never persisted
- UI state ephemeral

## Security Architecture

### Context Isolation

```typescript
webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    nodeIntegration: false,
    contextIsolation: true,
    devTools: is.dev
}
```

### Token Handling

- Tokens stored in memory only
- Never written to disk
- Cleared on application exit
- Transmitted over HTTPS only

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src https://discord.com;">
```

## API Integration

### Discord API Client

```typescript
class DiscordAPI {
    private token: string
    private baseURL = 'https://discord.com/api/v9'
    
    async fetchWithRateLimit(url: string, options: RequestInit) {
        const response = await fetch(url, options)
        
        if (response.status === 429) {
            const data = await response.json()
            await this.sleep((data.retry_after || 1) * 1000)
            return this.fetchWithRateLimit(url, options)
        }
        
        return response
    }
    
    async deleteMessage(channelId: string, messageId: string) {
        return this.fetchWithRateLimit(
            `${this.baseURL}/channels/${channelId}/messages/${messageId}`,
            {
                method: 'DELETE',
                headers: { 'Authorization': this.token }
            }
        )
    }
}
```

### Rate Limiting Strategy

- Configurable delay between requests (default: 600ms)
- Automatic retry on 429 responses
- Exponential backoff on repeated failures
- Per-channel rate limit tracking

## Performance Optimizations

### Batch Processing

```typescript
// Fetch messages in batches
const BATCH_SIZE = 100
let lastMessageId: string | null = null

while (hasMore) {
    const url = `${baseURL}/channels/${channelId}/messages?limit=${BATCH_SIZE}${
        lastMessageId ? `&before=${lastMessageId}` : ''
    }`
    
    const messages = await fetch(url)
    // Process messages...
    
    lastMessageId = messages[messages.length - 1].id
    hasMore = messages.length === BATCH_SIZE
}
```

### Virtual Scrolling

- Large lists use windowing
- Only visible items rendered
- Smooth scrolling maintained

### Memoization

```typescript
// Memoize expensive computations
const filteredDMs = useMemo(() => {
    return dmChannels.filter(dm => {
        const recipient = dm.recipients[0]
        return recipient?.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    })
}, [dmChannels, searchQuery])
```

## Build Process

### Development Build

```bash
npm run dev
# 1. Vite dev server starts
# 2. Electron launches with hot reload
# 3. Changes reflected instantly
```

### Production Build

```bash
npm run build
# 1. TypeScript compilation
# 2. Vite production build
# 3. Code minification
# 4. Asset optimization

npm run build:win
# 5. Electron Builder packages
# 6. NSIS installer created
# 7. Portable executable generated
```

## Testing Strategy

### Type Safety

- TypeScript strict mode enabled
- All components typed
- API responses validated

### Manual Testing

- Cross-platform testing
- Rate limit testing
- Error scenario testing
- UI/UX testing

## Deployment

### Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create git tag
4. GitHub Actions builds all platforms
5. Artifacts uploaded to releases
6. Release notes published

### Distribution Channels

- GitHub Releases (primary)
- Direct download links
- Package managers (future)

## Monitoring and Logging

### Console Logging

```typescript
console.log('[TOKEN-DISCOVERY] Starting token scan...')
console.log('[ACCOUNT-FOUND] username#0000')
console.log('[DELETE-SUCCESS] Message deleted')
console.error('[API-ERROR] Rate limit exceeded')
```

### Error Tracking

- Errors logged to console
- User-friendly error messages
- Detailed error context

## Future Improvements

### Planned Enhancements

- Database for message history
- Advanced filtering options
- Scheduled cleaning tasks
- Cloud backup integration
- Plugin system
- Multi-language support

### Technical Debt

- Add unit tests
- Implement E2E tests
- Improve error handling
- Add performance monitoring
- Implement analytics (opt-in)

---

This architecture is designed for maintainability, security, and performance while providing a great user experience.
