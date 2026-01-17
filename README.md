# Wildflover DM Cleaner

<div align="center">

![Wildflover DM Cleaner](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Discord API](https://img.shields.io/badge/Discord%20API-v9-5865F2?style=for-the-badge&logo=discord&logoColor=white)

**Professional Discord message management tool built with Electron, React, and TypeScript**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [License](#license)

</div>

---

## Overview

Wildflover DM Cleaner is a powerful desktop application designed for efficient Discord message management. Built with modern technologies and a focus on performance, security, and user experience.

### Key Highlights

- **Fast & Efficient**: Optimized batch processing with configurable delays
- **Secure**: Context isolation, sandbox mode, and local token discovery
- **Modern UI**: Beautiful gradient-based interface with smooth animations
- **Cross-Platform**: Windows, macOS, and Linux support
- **Professional**: Enterprise-grade logging and error handling

---

## Features

### Core Functionality

- **Automated Token Discovery**: Automatically detects Discord tokens from local storage
- **Manual Token Login**: Secure manual token input for additional accounts
- **Batch Message Deletion**: Delete messages from multiple conversations simultaneously
- **Real-time Progress Tracking**: Live updates with detailed statistics
- **Comprehensive Logging**: Professional logging system with color-coded output
- **Friends Management**: View and interact with your Discord friends list
- **Chat Preview**: Preview conversations before cleaning

### Advanced Features

- **Configurable Settings**:
  - Delete delay (rate limiting protection)
  - Batch size control
  - Auto-refresh toggle
  - Auto-scroll in logs
  - Stop on error option

- **Statistics & Analytics**:
  - Total messages deleted
  - Text messages count
  - Images/attachments count
  - Embeds count
  - Per-channel breakdown

- **User Experience**:
  - Smooth animations with Framer Motion
  - Custom scrollbars
  - Gradient-based modern design
  - Responsive layout
  - Professional titlebar

---

## Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/wildflover/dm-cleaner.git
cd dm-cleaner

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Create installer (Windows)
npm run build:installer

# Create portable version (Windows)
npm run build:portable
```

### Platform-Specific Builds

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# All platforms
npm run build:all
```

---

## Usage

### Getting Started

1. **Launch the Application**: Open Wildflover DM Cleaner
2. **Select Account**: Choose from automatically discovered accounts or use manual token login
3. **Browse Conversations**: View all your DM channels and group DMs
4. **Select Channels**: Choose which conversations to clean
5. **Start Cleaning**: Click the "Clean" button and monitor progress
6. **Review Summary**: Check detailed statistics after completion

### Manual Token Login

If automatic discovery doesn't find your account:

1. Open Discord in your browser
2. Press `F12` to open Developer Tools
3. Go to Console tab
4. Type: `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`
5. Copy the token (without quotes)
6. Click "Manual Token Login" in the app
7. Paste your token

> **Warning**: Never share your Discord token with anyone. Treat it like a password.

### Configuration

Access settings from the sidebar to customize:

- **Delete Delay**: Time between deletions (default: 600ms)
- **Batch Size**: Messages per request (default: 100)
- **Auto Refresh**: Automatically refresh conversation list
- **Auto Scroll**: Auto-scroll logs during cleaning
- **Stop on Error**: Halt operation if an error occurs

---

## Development

### Project Structure

```
dm-cleaner/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Application entry point
│   │   └── token-discovery.ts  # Token discovery logic
│   ├── preload/           # Preload scripts
│   │   └── index.ts       # IPC bridge
│   └── renderer/          # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── assets/         # Images, styles, badges
│       │   ├── types/          # TypeScript definitions
│       │   ├── utils/          # Utility functions
│       │   ├── App.tsx         # Main app component
│       │   └── Dashboard.tsx   # Dashboard component
│       └── index.html
├── build/                 # Build resources
├── dist/                  # Production builds
├── badges/                # Discord badge assets
├── package.json
├── electron.vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Tech Stack

- **Framework**: Electron 27
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Electron Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Build application
npm run build

# Preview production build
npm run preview

# Convert icons
npm run icon:convert
```

### API Integration

This application uses Discord API v9:

- **Base URL**: `https://discord.com/api/v9`
- **Authentication**: Bearer token
- **Rate Limiting**: Automatic retry with exponential backoff
- **Endpoints Used**:
  - `/users/@me` - User profile
  - `/users/@me/channels` - DM channels
  - `/users/@me/relationships` - Friends list
  - `/channels/{id}/messages` - Message history
  - `DELETE /channels/{id}/messages/{id}` - Delete message

---

## Security

### Best Practices

- **Token Storage**: Tokens are never stored permanently
- **Context Isolation**: Enabled for security
- **Sandbox Mode**: Renderer process runs in sandbox
- **No Remote Code**: All code is bundled and verified
- **HTTPS Only**: All API calls use HTTPS

### Privacy

- **Local Processing**: All operations happen locally
- **No Telemetry**: No data collection or tracking
- **No External Services**: Direct Discord API communication only
- **Open Source**: Full transparency of code

---

## Building from Source

### Requirements

- Node.js 18+
- npm or yarn
- Python 3 (for native modules)
- Visual Studio Build Tools (Windows)
- Xcode Command Line Tools (macOS)

### Build Process

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Create distributable
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### Output

- **Windows**: `dist/Wildflover-DM-Cleaner-1.0.0-Setup.exe`
- **Portable**: `dist/Wildflover-DM-Cleaner-1.0.0-Portable.exe`
- **macOS**: `dist/Wildflover DM Cleaner.dmg`
- **Linux**: `dist/Wildflover-DM-Cleaner-1.0.0.AppImage`

---

## Troubleshooting

### Common Issues

**Token Not Found**
- Ensure Discord is installed and you're logged in
- Try manual token login
- Check if Discord is running

**Rate Limiting**
- Increase delete delay in settings
- Reduce batch size
- Wait a few minutes before retrying

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Update dependencies: `npm update`

**Application Won't Start**
- Check if port 5173 is available (dev mode)
- Verify Node.js version: `node --version`
- Check logs in console

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## Roadmap

- [ ] Multi-language support (i18n)
- [ ] Server message management
- [ ] Scheduled cleaning
- [ ] Export message history
- [ ] Advanced filtering options
- [ ] Backup before deletion
- [ ] Dark/Light theme toggle
- [ ] Custom badge support

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

This tool is for educational purposes and personal use only. Use at your own risk. The author is not responsible for any account actions taken by Discord. Always follow Discord's Terms of Service.

**Important**: Automated user account actions may violate Discord's Terms of Service. This tool is intended for managing your own messages only.

---

## Author

**Wildflover**

- GitHub: [@wildflover](https://github.com/wildflover)

---

## Acknowledgments

- Discord for their API
- Electron team for the framework
- React team for the library
- All open-source contributors

---

<div align="center">

**Made with ❤️ by Wildflover**

If you find this project useful, please consider giving it a ⭐

</div>
