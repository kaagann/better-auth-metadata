# 📦 Package Structure

```
better-auth-metadata/
│
├── 📄 Configuration Files
│   ├── package.json          # NPM package configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tsup.config.ts        # Build configuration (tsup)
│   ├── .gitignore            # Git ignore rules
│   └── .npmignore            # NPM publish ignore rules
│
├── 📁 Source Code (src/)
│   ├── index.ts              # Server plugin (main entry)
│   └── client.ts             # Client plugin
│
├── 📁 Build Output (dist/) - Generated after build
│   ├── index.js              # CommonJS server
│   ├── index.mjs             # ES Module server
│   ├── index.d.ts            # TypeScript types
│   ├── client.js             # CommonJS client
│   ├── client.mjs            # ES Module client
│   └── client.d.ts           # TypeScript types
│
└── 📚 Documentation
    ├── README.md             # Main documentation
    ├── INSTALLATION.md       # Installation & publishing guide
    ├── CHANGELOG.md          # Version history
    ├── CONTRIBUTING.md       # Contribution guidelines
    └── LICENSE               # MIT License

```

## 🎯 Entry Points

### Main (Server Plugin)
```typescript
import { metadata } from "better-auth-metadata";
```
**Files:** `dist/index.js` (CJS), `dist/index.mjs` (ESM)

### Client Plugin
```typescript
import { metadataClient } from "better-auth-metadata/client";
```
**Files:** `dist/client.js` (CJS), `dist/client.mjs` (ESM)

## 📊 File Sizes (Estimated)

- **Source Code:** ~5 KB
- **Built (minified):** ~3 KB
- **Types:** ~2 KB
- **Total Package:** ~10 KB (unpacked)

## 🔍 What Gets Published to NPM?

Only these files/folders are published (defined in `files` field):
- ✅ `dist/` - Build output
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - License file
- ✅ `package.json` - Package metadata

Everything else is excluded via `.npmignore`.

## 🛠️ Build Process

```bash
npm run build
```

**What happens:**
1. TypeScript files in `src/` are compiled
2. Two formats generated: CommonJS (`.js`) and ES Module (`.mjs`)
3. Type definitions (`.d.ts`) are generated
4. Source maps (`.map`) are created
5. Output goes to `dist/` folder

## 📦 Package Exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  },
  "./client": {
    "types": "./dist/client.d.ts",
    "import": "./dist/client.mjs",
    "require": "./dist/client.js"
  }
}
```

This enables:
- ✅ TypeScript autocomplete
- ✅ ES Module imports
- ✅ CommonJS requires
- ✅ Tree-shaking support

## 🔄 Development Workflow

1. **Make changes** in `src/`
2. **Build** with `npm run build`
3. **Test locally** with `npm link`
4. **Bump version** with `npm version [patch|minor|major]`
5. **Publish** with `npm publish`

## 📝 Version Control

- **Git:** Tracks all source files
- **NPM:** Only publishes `dist/` and docs
- **GitHub:** Full repository with history

## 🎨 Code Style

- TypeScript strict mode enabled
- ES2020 target
- ESModules format
- Full type safety
- JSDoc comments for public APIs
