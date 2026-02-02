# Contributing to Agent MeCode

Thank you for your interest in contributing to Agent MeCode! This document provides guidelines and instructions for contributing.

## Ways to Contribute

- **Report Bugs**: Open an issue describing the bug
- **Suggest Features**: Open an issue with your feature proposal
- **Submit Pull Requests**: Fix bugs or implement new features
- **Improve Documentation**: Help us improve our docs
- **Share**: Star the repo and spread the word

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/nooqle/agent-mecode.git
cd agent-mecode

# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test
```

### Web Application

```bash
cd web
npm install
npm run dev
```

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes (`npm test`)
5. **Commit** with a clear message (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add new card theme
fix: resolve SVG parsing issue
docs: update README examples
refactor: simplify generator logic
test: add SDK unit tests
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Questions?

Feel free to open an issue or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
