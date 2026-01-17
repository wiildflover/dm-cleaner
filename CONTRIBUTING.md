# Contributing to Wildflover DM Cleaner

Thank you for your interest in contributing to Wildflover DM Cleaner! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** and motivation
- **Proposed solution** or implementation
- **Alternative solutions** considered
- **Additional context** or screenshots

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** guidelines below
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit the pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/dm-cleaner.git
cd dm-cleaner

# Add upstream remote
git remote add upstream https://github.com/wildflover/dm-cleaner.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop types

### Naming Conventions

- **Components**: PascalCase (e.g., `DMListView.tsx`)
- **Functions**: camelCase (e.g., `loadDashboardData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `APP_CONFIG`)
- **Files**: kebab-case for utilities, PascalCase for components

### Comments

- Write comments in English
- Use JSDoc for functions and components
- Include author information in file headers
- Explain complex logic with inline comments

### File Headers

All files should include a header comment:

```typescript
/**
 * @file filename.ts
 * @author Wildflover
 * @description Brief description of the file's purpose
 * @language TypeScript
 */
```

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(dashboard): add message filtering by date

fix(token-discovery): handle missing Discord installation

docs(readme): update installation instructions

refactor(api): improve error handling in message deletion
```

## Testing

- Test your changes on multiple platforms if possible
- Verify that existing functionality still works
- Test edge cases and error scenarios
- Check for memory leaks in long-running operations

## Documentation

- Update README.md for user-facing changes
- Update code comments for implementation changes
- Add JSDoc comments for new functions
- Update CHANGELOG.md with your changes

## Project Structure

```
src/
├── main/              # Electron main process
├── preload/           # Preload scripts
└── renderer/          # React frontend
    ├── components/    # React components
    ├── assets/        # Static assets
    ├── types/         # TypeScript types
    └── utils/         # Utility functions
```

## Building and Testing

```bash
# Type checking
npm run typecheck

# Build for development
npm run build

# Build for production
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Contact the maintainer

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Wildflover DM Cleaner!
