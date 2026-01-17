# Security Policy

## Supported Versions

Currently supported versions of Wildflover DM Cleaner:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Disclose Publicly

Please do not create a public GitHub issue for security vulnerabilities. This helps protect users while we work on a fix.

### 2. Report Privately

Send details to the project maintainer through:
- GitHub Security Advisories (preferred)
- Direct message on GitHub

### 3. Include Details

When reporting, please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

## Security Best Practices

### For Users

1. **Token Security**
   - Never share your Discord token
   - Treat tokens like passwords
   - Use manual login only when necessary
   - Log out when done using the application

2. **Download Safety**
   - Only download from official sources
   - Verify checksums of downloaded files
   - Keep the application updated

3. **System Security**
   - Use antivirus software
   - Keep your OS updated
   - Use strong passwords
   - Enable two-factor authentication on Discord

### For Developers

1. **Code Security**
   - Review all dependencies regularly
   - Use `npm audit` to check for vulnerabilities
   - Follow secure coding practices
   - Validate all user inputs

2. **Token Handling**
   - Never log tokens
   - Never store tokens permanently
   - Use secure memory handling
   - Clear tokens on application exit

3. **API Security**
   - Use HTTPS only
   - Implement rate limiting
   - Handle errors gracefully
   - Validate API responses

## Security Features

### Application Security

1. **Context Isolation**
   - Enabled for all renderer processes
   - Prevents code injection attacks
   - Isolates untrusted content

2. **Sandbox Mode**
   - Renderer process runs in sandbox
   - Limited system access
   - Enhanced security boundary

3. **No Remote Code**
   - All code is bundled
   - No external script loading
   - Verified build process

4. **DevTools Protection**
   - Disabled in production
   - Keyboard shortcuts blocked
   - Prevents unauthorized access

### Data Security

1. **Local Processing**
   - All operations happen locally
   - No data sent to external servers
   - Direct Discord API communication only

2. **No Telemetry**
   - No usage tracking
   - No analytics collection
   - No data sharing

3. **Token Management**
   - Tokens stored in memory only
   - Cleared on application exit
   - Never written to disk

4. **HTTPS Only**
   - All API calls use HTTPS
   - Certificate validation
   - Secure communication

## Known Security Considerations

### Discord API Usage

This application uses Discord's API to manage messages. Please note:

1. **Terms of Service**
   - Automated user account actions may violate Discord's ToS
   - Use at your own risk
   - Intended for personal use only

2. **Rate Limiting**
   - Discord enforces rate limits
   - Application implements delays
   - Excessive use may result in temporary blocks

3. **Account Security**
   - Using tokens outside official clients is risky
   - Discord may flag unusual activity
   - Enable 2FA for additional protection

### Application Permissions

The application requires:

1. **File System Access**
   - To discover tokens from Discord installation
   - Read-only access to Discord directories
   - No modification of Discord files

2. **Network Access**
   - To communicate with Discord API
   - HTTPS connections only
   - No other external connections

3. **System Resources**
   - Normal application privileges
   - No elevated permissions required
   - Standard user access level

## Vulnerability Disclosure

### Responsible Disclosure

We follow responsible disclosure practices:

1. **Acknowledgment**
   - We acknowledge all valid reports
   - Credit given to reporters (if desired)
   - Public disclosure after fix

2. **Fix Process**
   - Develop and test fix
   - Release security update
   - Notify affected users

3. **Public Disclosure**
   - After fix is released
   - Coordinated with reporter
   - Security advisory published

### Hall of Fame

We recognize security researchers who help improve our security:

*No reports yet - be the first!*

## Security Updates

### Update Policy

- Security updates are released as soon as possible
- Users are notified through GitHub releases
- Critical updates are marked clearly

### Checking for Updates

1. Check GitHub releases page
2. Watch the repository for notifications
3. Enable GitHub notifications

### Applying Updates

1. Download latest version
2. Backup your settings (if applicable)
3. Install new version
4. Verify installation

## Additional Resources

- [Discord API Documentation](https://discord.com/developers/docs)
- [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Contact

For security concerns, contact:
- GitHub: [@wildflover](https://github.com/wildflover)
- Security Advisories: Use GitHub's private reporting feature

---

**Last Updated**: January 17, 2025

Thank you for helping keep Wildflover DM Cleaner secure!
