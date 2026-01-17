# Changelog

All notable changes to Wildflover DM Cleaner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-17

### Added

#### Core Features
- Automated Discord token discovery from local storage
- Manual token login with validation
- Batch message deletion with configurable delays
- Real-time progress tracking with live statistics
- Comprehensive logging system with color-coded output
- Friends list management and viewing
- Chat preview functionality
- Multi-account support

#### User Interface
- Modern gradient-based design with blue theme
- Smooth animations using Framer Motion
- Custom scrollbars for better aesthetics
- Professional titlebar with window controls
- Responsive layout for different screen sizes
- Background image support with overlay gradients
- Discord badge rendering system

#### Settings & Configuration
- Configurable delete delay (rate limiting protection)
- Adjustable batch size for message fetching
- Auto-refresh toggle for conversation list
- Auto-scroll option for logs
- Stop on error functionality
- Delete attachments option

#### Statistics & Analytics
- Total messages deleted counter
- Text messages breakdown
- Images/attachments count
- Embeds count
- Per-channel deletion statistics
- Summary modal with detailed breakdown
- Channel list modal with individual stats

#### Developer Features
- Professional logging with tagged output
- Application banner in console
- Platform detection and configuration
- Hardware acceleration support
- Context isolation for security
- Sandbox mode for renderer process
- DevTools shortcuts disabled in production

### Technical Details

#### Architecture
- Electron 27 for desktop application framework
- React 18 with TypeScript for frontend
- Electron Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations

#### API Integration
- Discord API v9 implementation
- Rate limiting handling with retry logic
- Proper error handling and recovery
- Batch processing optimization
- Token validation and authentication

#### Build System
- Windows installer (NSIS)
- Portable Windows executable
- macOS DMG support
- Linux AppImage and DEB packages
- Icon conversion utilities
- Multi-platform build scripts

### Security
- Context isolation enabled
- Sandbox mode for renderer
- No token persistence
- HTTPS-only API communication
- DevTools protection in production

### Performance
- Optimized batch processing
- Efficient message deletion
- Memory leak prevention
- Smooth animations with GPU acceleration
- Lazy loading for large lists

---

## [Unreleased]

### Planned Features
- Multi-language support (i18n)
- Server message management
- Scheduled cleaning tasks
- Message history export
- Advanced filtering options
- Backup before deletion
- Dark/Light theme toggle
- Custom badge support
- Message search functionality
- Bulk friend management

### Under Consideration
- Message recovery feature
- Cloud backup integration
- Automated cleanup rules
- Message analytics dashboard
- Custom themes support
- Plugin system
- Command-line interface

---

## Version History

- **1.0.0** (2025-01-17) - Initial release

---

## Notes

### Breaking Changes
None - Initial release

### Deprecations
None - Initial release

### Known Issues
- Rate limiting may occur with very large message counts
- Some Discord badges may not render correctly
- Manual token login required for some account types

### Migration Guide
Not applicable - Initial release

---

For more information, visit the [GitHub repository](https://github.com/wildflover/dm-cleaner).
