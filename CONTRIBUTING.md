# Contributing to better-auth-metadata

Thank you for your interest in contributing to better-auth-metadata! This guide will help you get started.

## Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/better-auth-metadata.git
cd better-auth-metadata
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Build the project**

```bash
npm run build
```

4. **Watch mode for development**

```bash
npm run dev
```

## Project Structure

```
better-auth-metadata/
├── src/
│   ├── index.ts          # Server plugin
│   └── client.ts         # Client plugin
├── dist/                 # Build output (generated)
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## Making Changes

1. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Edit files in the `src/` directory
- Follow the existing code style
- Add JSDoc comments for public APIs
- Maintain type safety

3. **Test your changes**

```bash
npm run build
npm run type-check
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md following the existing format
3. Ensure all TypeScript checks pass
4. Create a pull request with a clear description

## Code Style

- Use TypeScript for all code
- Follow the existing code formatting
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions small and focused

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
