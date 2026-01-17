# Frequently Asked Questions

Common questions and answers about Wildflover DM Cleaner.

## General Questions

### What is Wildflover DM Cleaner?

Wildflover DM Cleaner is a desktop application that helps you manage and delete your Discord direct messages efficiently. It's built with Electron, React, and TypeScript for a modern, secure experience.

### Is it safe to use?

Yes, the application is safe to use. It:
- Runs locally on your computer
- Uses official Discord API endpoints
- Never stores your token permanently
- Is open-source for transparency
- Implements security best practices

However, note that automated user account actions may violate Discord's Terms of Service. Use at your own risk.

### Is it free?

Yes, Wildflover DM Cleaner is completely free and open-source under the MIT License.

### Which platforms are supported?

- Windows 10/11
- macOS 10.13+
- Linux (Ubuntu 18.04+, Fedora, Arch, etc.)

## Installation & Setup

### How do I install it?

Download the appropriate installer for your platform from the [Releases page](https://github.com/wildflover/dm-cleaner/releases) and follow the installation instructions.

See [INSTALLATION.md](../INSTALLATION.md) for detailed instructions.

### Do I need Discord installed?

For automatic token discovery, yes. However, you can use manual token login without having Discord installed.

### How do I get my Discord token?

The application can automatically discover tokens from your Discord installation. Alternatively, you can manually obtain your token:

1. Open Discord in your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Paste and run the token extraction script (see README)
5. Copy the token

**Warning:** Never share your token with anyone!

### Why isn't my account showing up?

Possible reasons:
- Discord isn't installed
- You're not logged in to Discord
- Discord is using a different profile
- Try manual token login instead

## Usage Questions

### Can I delete messages from multiple conversations at once?

Yes! Select multiple DM channels and click "Clean" to process them all in one operation.

### Will this delete the other person's messages?

No, it only deletes YOUR messages. The other person's messages remain untouched.

### Can I undo deletions?

No, message deletion is permanent. There's no way to recover deleted messages through the application.

### How fast can I delete messages?

The speed depends on:
- Your delete delay setting (default: 600ms)
- Discord's rate limits
- Number of messages
- Your internet connection

Typical speed: 5-10 messages per second

### Why is there a delay between deletions?

The delay prevents rate limiting by Discord. If you delete too quickly, Discord will temporarily block your requests.

### Can I delete messages from servers/guilds?

Currently, no. The application only supports DM and Group DM channels. Server message management may be added in future versions.

### Can I filter which messages to delete?

Not yet. Currently, all your messages in selected channels are deleted. Advanced filtering (by date, content, attachments) is planned for future releases.

## Technical Questions

### How does token discovery work?

The application scans Discord's local storage directories:
- Windows: `%APPDATA%\discord\Local Storage\leveldb`
- macOS: `~/Library/Application Support/discord/Local Storage/leveldb`
- Linux: `~/.config/discord/Local Storage/leveldb`

It extracts tokens from the LevelDB database and validates them via Discord API.

### Is my token stored anywhere?

No, tokens are only stored in memory while the application is running. They're never written to disk or transmitted anywhere except to Discord's API.

### What data does the application collect?

None. The application:
- Doesn't collect any telemetry
- Doesn't track usage
- Doesn't send data to external servers
- Only communicates with Discord's API

### Can I use this with Discord bots?

No, this application is designed for user accounts only. Bot tokens use a different authentication method.

### Does this work with Discord PTB or Canary?

Yes, the token discovery works with:
- Discord Stable
- Discord PTB (Public Test Build)
- Discord Canary
- Discord Development

## Troubleshooting

### The application won't start

Try:
- Updating to the latest version
- Reinstalling the application
- Checking system requirements
- Reviewing error logs

### I'm getting rate limited

- Increase the delete delay in settings
- Reduce batch size
- Wait a few minutes before retrying
- Discord may have temporarily restricted your account

### Token validation fails

- Ensure you copied the entire token
- Check if you're logged in to Discord
- Try logging out and back in to Discord
- Generate a new token

### Messages aren't being deleted

Possible causes:
- Rate limiting (wait and retry)
- Network issues
- Invalid token
- Discord API issues

Check the logs for specific error messages.

### The application is slow

- Close other applications
- Check your internet connection
- Reduce batch size in settings
- Ensure your system meets requirements

## Privacy & Security

### Is my data private?

Yes, all operations happen locally on your computer. The application only communicates with Discord's API to perform actions.

### Can others see what I'm doing?

No, the application doesn't broadcast your actions. However, Discord may log API requests on their end.

### What happens to my token when I close the app?

The token is cleared from memory when you close the application. It's never persisted to disk.

### Is the source code auditable?

Yes, the entire source code is available on GitHub. You can review it, audit it, or even build it yourself.

## Legal & Terms

### Is this against Discord's Terms of Service?

Automated user account actions may violate Discord's Terms of Service. The application is provided for educational purposes and personal use. Use at your own risk.

### Can my account be banned?

While unlikely for normal use, Discord reserves the right to take action against accounts that violate their Terms of Service. Use responsibly.

### What's the license?

MIT License - you're free to use, modify, and distribute the software. See [LICENSE](../LICENSE) for details.

## Contributing

### How can I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Reporting bugs
- Suggesting features
- Submitting pull requests
- Code style guidelines

### I found a bug, what should I do?

1. Check if it's already reported in [Issues](https://github.com/wildflover/dm-cleaner/issues)
2. If not, create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information
   - Screenshots if applicable

### I have a feature request

Great! Open a feature request issue with:
- Clear description of the feature
- Use case and benefits
- Any implementation ideas

## Future Plans

### What features are planned?

See [CHANGELOG.md](../CHANGELOG.md) for the roadmap, including:
- Multi-language support
- Server message management
- Advanced filtering
- Scheduled cleaning
- Message export
- And more!

### When will feature X be released?

We don't have specific timelines. Features are prioritized based on:
- User demand
- Technical feasibility
- Development resources
- Community contributions

## Support

### Where can I get help?

- Read the [README](../README.md)
- Check this FAQ
- Search [GitHub Issues](https://github.com/wildflover/dm-cleaner/issues)
- Create a new issue if needed

### How do I report a security vulnerability?

See [SECURITY.md](../SECURITY.md) for responsible disclosure guidelines.

### Can I contact the developer directly?

For general questions, please use GitHub Issues or Discussions. For security concerns, follow the guidelines in SECURITY.md.

---

**Didn't find your answer?** Open an issue on [GitHub](https://github.com/wildflover/dm-cleaner/issues) and we'll help you out!
