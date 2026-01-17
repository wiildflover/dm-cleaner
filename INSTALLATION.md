# Installation Guide

Comprehensive installation instructions for Wildflover DM Cleaner across different platforms.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Platform-Specific Instructions](#platform-specific-instructions)
- [Building from Source](#building-from-source)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **RAM**: 4 GB
- **Disk Space**: 200 MB free space
- **Internet**: Required for Discord API communication

### Recommended Requirements

- **Operating System**: Windows 11, macOS 12+, or Linux (Ubuntu 22.04+)
- **RAM**: 8 GB or more
- **Disk Space**: 500 MB free space
- **Display**: 1920x1080 or higher resolution

---

## Quick Installation

### Windows

1. Download `Wildflover-DM-Cleaner-1.0.0-Setup.exe` from [Releases](https://github.com/wildflover/dm-cleaner/releases)
2. Run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

**Portable Version:**
- Download `Wildflover-DM-Cleaner-1.0.0-Portable.exe`
- Run directly without installation
- No admin rights required

### macOS

1. Download `Wildflover-DM-Cleaner-1.0.0.dmg` from [Releases](https://github.com/wildflover/dm-cleaner/releases)
2. Open the DMG file
3. Drag the app to Applications folder
4. Launch from Applications or Launchpad

**First Launch:**
- Right-click the app and select "Open"
- Click "Open" in the security dialog
- This is required for unsigned apps

### Linux

**AppImage (Recommended):**
```bash
# Download AppImage
wget https://github.com/wildflover/dm-cleaner/releases/download/v1.0.0/Wildflover-DM-Cleaner-1.0.0.AppImage

# Make executable
chmod +x Wildflover-DM-Cleaner-1.0.0.AppImage

# Run
./Wildflover-DM-Cleaner-1.0.0.AppImage
```

**Debian/Ubuntu (.deb):**
```bash
# Download DEB package
wget https://github.com/wildflover/dm-cleaner/releases/download/v1.0.0/wildflover-dm-cleaner_1.0.0_amd64.deb

# Install
sudo dpkg -i wildflover-dm-cleaner_1.0.0_amd64.deb

# Fix dependencies if needed
sudo apt-get install -f

# Run
wildflover-dm-cleaner
```

---

## Platform-Specific Instructions

### Windows Detailed Setup

#### Using Installer (NSIS)

1. **Download Installer**
   - Visit the [Releases page](https://github.com/wildflover/dm-cleaner/releases)
   - Download `Wildflover-DM-Cleaner-1.0.0-Setup.exe`

2. **Run Installer**
   - Double-click the downloaded file
   - Windows SmartScreen may appear - click "More info" then "Run anyway"

3. **Installation Options**
   - Choose installation directory (default: `C:\Program Files\Wildflover DM Cleaner`)
   - Select components to install
   - Choose Start Menu folder
   - Create desktop shortcut (optional)

4. **Complete Installation**
   - Click "Install" to begin
   - Wait for installation to complete
   - Click "Finish" to launch the application

#### Using Portable Version

1. **Download Portable**
   - Download `Wildflover-DM-Cleaner-1.0.0-Portable.exe`

2. **Extract and Run**
   - No installation required
   - Run directly from any location
   - Settings stored in same directory

3. **Benefits**
   - No admin rights needed
   - Run from USB drive
   - Leave no traces on system

### macOS Detailed Setup

#### Installation Steps

1. **Download DMG**
   - Visit [Releases page](https://github.com/wildflover/dm-cleaner/releases)
   - Download `Wildflover-DM-Cleaner-1.0.0.dmg`

2. **Mount DMG**
   - Double-click the DMG file
   - A new window will open

3. **Install Application**
   - Drag "Wildflover DM Cleaner" to Applications folder
   - Wait for copy to complete

4. **First Launch**
   - Open Applications folder
   - Right-click "Wildflover DM Cleaner"
   - Select "Open" from context menu
   - Click "Open" in security dialog

#### Gatekeeper Issues

If macOS blocks the app:

```bash
# Remove quarantine attribute
xattr -cr "/Applications/Wildflover DM Cleaner.app"
```

Or go to:
- System Preferences → Security & Privacy
- Click "Open Anyway" for Wildflover DM Cleaner

### Linux Detailed Setup

#### AppImage

**Advantages:**
- No installation required
- Works on most distributions
- Self-contained

**Setup:**
```bash
# Download
wget https://github.com/wildflover/dm-cleaner/releases/download/v1.0.0/Wildflover-DM-Cleaner-1.0.0.AppImage

# Make executable
chmod +x Wildflover-DM-Cleaner-1.0.0.AppImage

# Optional: Move to /usr/local/bin
sudo mv Wildflover-DM-Cleaner-1.0.0.AppImage /usr/local/bin/wildflover-dm-cleaner

# Run
wildflover-dm-cleaner
```

**Desktop Integration:**
```bash
# Create desktop entry
cat > ~/.local/share/applications/wildflover-dm-cleaner.desktop << EOF
[Desktop Entry]
Name=Wildflover DM Cleaner
Exec=/usr/local/bin/wildflover-dm-cleaner
Icon=wildflover-dm-cleaner
Type=Application
Categories=Utility;
EOF
```

#### Debian/Ubuntu Package

```bash
# Download
wget https://github.com/wildflover/dm-cleaner/releases/download/v1.0.0/wildflover-dm-cleaner_1.0.0_amd64.deb

# Install
sudo dpkg -i wildflover-dm-cleaner_1.0.0_amd64.deb

# Fix dependencies
sudo apt-get install -f

# Launch
wildflover-dm-cleaner
```

#### Arch Linux (AUR)

```bash
# Using yay
yay -S wildflover-dm-cleaner

# Using paru
paru -S wildflover-dm-cleaner

# Manual
git clone https://aur.archlinux.org/wildflover-dm-cleaner.git
cd wildflover-dm-cleaner
makepkg -si
```

---

## Building from Source

### Prerequisites

Install required tools:

**Windows:**
```powershell
# Install Node.js
winget install OpenJS.NodeJS.LTS

# Install Git
winget install Git.Git

# Install Visual Studio Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools
```

**macOS:**
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Git
brew install git

# Install Xcode Command Line Tools
xcode-select --install
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm git build-essential

# Fedora
sudo dnf install nodejs npm git gcc-c++ make

# Arch
sudo pacman -S nodejs npm git base-devel
```

### Build Steps

1. **Clone Repository**
```bash
git clone https://github.com/wildflover/dm-cleaner.git
cd dm-cleaner
```

2. **Install Dependencies**
```bash
npm install
```

3. **Build Application**
```bash
# Development build
npm run build

# Production build for current platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

4. **Output Location**
- Windows: `dist/Wildflover-DM-Cleaner-1.0.0-Setup.exe`
- macOS: `dist/Wildflover DM Cleaner.dmg`
- Linux: `dist/Wildflover-DM-Cleaner-1.0.0.AppImage`

---

## Troubleshooting

### Common Issues

#### Windows

**Issue: "Windows protected your PC" message**
- Click "More info"
- Click "Run anyway"
- This is normal for unsigned applications

**Issue: Installation fails**
- Run installer as administrator
- Disable antivirus temporarily
- Check disk space

**Issue: Application won't start**
- Install Visual C++ Redistributable
- Update Windows to latest version
- Check Windows Event Viewer for errors

#### macOS

**Issue: "App is damaged and can't be opened"**
```bash
xattr -cr "/Applications/Wildflover DM Cleaner.app"
```

**Issue: Permission denied**
```bash
sudo chmod -R 755 "/Applications/Wildflover DM Cleaner.app"
```

**Issue: App crashes on launch**
- Check Console.app for crash logs
- Ensure macOS is up to date
- Try removing and reinstalling

#### Linux

**Issue: AppImage won't run**
```bash
# Install FUSE
sudo apt install fuse libfuse2  # Ubuntu/Debian
sudo dnf install fuse fuse-libs  # Fedora
sudo pacman -S fuse2             # Arch

# Make executable
chmod +x Wildflover-DM-Cleaner-1.0.0.AppImage
```

**Issue: Missing libraries**
```bash
# Ubuntu/Debian
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0

# Fedora
sudo dnf install gtk3 libnotify nss libXScrnSaver libXtst xdg-utils at-spi2-atk libdrm mesa-libgbm

# Arch
sudo pacman -S gtk3 libnotify nss libxss libxtst xdg-utils at-spi2-atk libdrm mesa
```

### Getting Help

If you encounter issues:

1. Check [GitHub Issues](https://github.com/wildflover/dm-cleaner/issues)
2. Search for similar problems
3. Create a new issue with:
   - Operating system and version
   - Application version
   - Steps to reproduce
   - Error messages or logs
   - Screenshots if applicable

---

## Verification

### Verify Installation

**Windows:**
```powershell
# Check if installed
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*Wildflover*"}
```

**macOS:**
```bash
# Check if installed
ls -la "/Applications/Wildflover DM Cleaner.app"
```

**Linux:**
```bash
# Check if installed (DEB)
dpkg -l | grep wildflover

# Check AppImage
./Wildflover-DM-Cleaner-1.0.0.AppImage --version
```

### Verify Integrity

Check file checksums (SHA256):

```bash
# Windows
certutil -hashfile Wildflover-DM-Cleaner-1.0.0-Setup.exe SHA256

# macOS/Linux
shasum -a 256 Wildflover-DM-Cleaner-1.0.0.dmg
```

Compare with checksums in [CHECKSUMS.txt](https://github.com/wildflover/dm-cleaner/releases/download/v1.0.0/CHECKSUMS.txt)

---

## Next Steps

After installation:

1. Launch the application
2. Read the [Usage Guide](README.md#usage)
3. Configure settings as needed
4. Start managing your Discord messages

---

**Need Help?** Visit our [GitHub Discussions](https://github.com/wildflover/dm-cleaner/discussions) or [Issues](https://github.com/wildflover/dm-cleaner/issues) page.
