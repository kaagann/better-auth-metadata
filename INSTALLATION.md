# 📦 Better Auth Metadata - Installation & Publishing Guide

Bu doküman, `better-auth-metadata` paketini nasıl yayınlayacağınızı ve kullanacağınızı anlatır.

## 🚀 Paketi Yayınlama (Publishing to NPM)

### 1. NPM Hesabı Oluşturun

Eğer yoksa [npmjs.com](https://www.npmjs.com/signup) adresinden hesap oluşturun.

### 2. NPM'e Giriş Yapın

```bash
npm login
```

Kullanıcı adı, şifre ve email adresinizi girin.

### 3. Package.json'u Güncelleyin

`package.json` dosyasında şu bilgileri kendinize göre düzenleyin:

```json
{
  "name": "better-auth-metadata",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/better-auth-metadata.git"
  }
}
```

### 4. Paketi Build Edin

```bash
npm install
npm run build
```

Bu komut `dist/` klasörünü oluşturacak.

### 5. Paketi Test Edin (Local)

Yayınlamadan önce paketi local olarak test edebilirsiniz:

```bash
# Paketi global link edin
npm link

# Başka bir projede test edin
cd /path/to/your-test-project
npm link better-auth-metadata
```

### 6. Paketi Yayınlayın

```bash
npm publish
```

İlk kez yayınlıyorsanız ve paket ismi benzersiz değilse:

```bash
# Scoped package olarak yayınlayın
npm publish --access public
```

### 7. Yeni Versiyon Yayınlama

Değişiklik yaptıktan sonra:

```bash
# Versiyon tipini seçin: patch, minor, veya major
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Yayınlayın
npm publish
```

## 📥 Paketi Kullanma

### Kurulum

```bash
npm install better-auth-metadata
# or
pnpm add better-auth-metadata
# or
yarn add better-auth-metadata
```

### Kullanım

#### 1. Types Tanımlayın

```typescript
// types.ts
export interface UserMetadata {
  theme: "light" | "dark" | "system";
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
  };
}
```

#### 2. Server Setup

```typescript
// auth.ts
import { betterAuth } from "better-auth";
import { metadata } from "better-auth-metadata";
import type { UserMetadata } from "./types";

export const auth = betterAuth({
  database: {
    // your database config
  },
  plugins: [
    metadata<UserMetadata>(),
  ],
});
```

#### 3. Client Setup

```typescript
// auth-client.ts
import { createAuthClient } from "better-auth/client";
import { metadataClient } from "better-auth-metadata/client";
import type { UserMetadata } from "./types";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    metadataClient<UserMetadata>(),
  ],
});
```

#### 4. Kullanım

```typescript
// Metadata set et
await authClient.setMetadata({
  metadata: {
    theme: "dark",
    preferences: {
      notifications: true,
      emailUpdates: false,
    },
  },
  merge: true,
});

// Metadata al
const { data } = await authClient.getMetadata();
console.log(data.metadata?.theme);

// Nested field güncelle
await authClient.updateMetadata({
  path: "preferences.notifications",
  value: false,
});
```

## 🔧 Development

### Geliştirme Modu

```bash
npm run dev
```

Bu komut dosya değişikliklerini izleyip otomatik build eder.

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

## 📁 Proje Yapısı

```
better-auth-metadata/
├── src/
│   ├── index.ts          # Server plugin (default export)
│   └── client.ts         # Client plugin
├── dist/                 # Build output (CJS + ESM)
│   ├── index.js          # CommonJS server
│   ├── index.mjs         # ES Module server
│   ├── index.d.ts        # TypeScript definitions
│   ├── client.js         # CommonJS client
│   ├── client.mjs        # ES Module client
│   └── client.d.ts       # TypeScript definitions
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## 🎯 Import Yolları

### Server Plugin

```typescript
import { metadata } from "better-auth-metadata";
```

### Client Plugin

```typescript
import { metadataClient } from "better-auth-metadata/client";
```

## 🔄 Güncelleme (Update)

Paketi güncellemek için:

```bash
npm update better-auth-metadata
```

## ❌ Kaldırma (Uninstall)

```bash
npm uninstall better-auth-metadata
```

## 🐛 Sorun Giderme

### Build hatası alıyorsanız:

```bash
# Node modules ve dist'i temizleyin
rm -rf node_modules dist
npm install
npm run build
```

### Type hatası alıyorsanız:

```bash
# TypeScript cache'i temizleyin
rm -rf node_modules/.cache
npm run type-check
```

### NPM publish hatası:

```bash
# Giriş yapın
npm logout
npm login

# Package ismini kontrol edin (benzersiz olmalı)
npm search better-auth-metadata
```

## 📝 Notlar

- Paket hem CommonJS hem de ES Module formatını destekler
- TypeScript definitions otomatik oluşturulur
- Better Auth v1.0.0+ gereklidir
- Node.js 18+ önerilir

## 🔗 Linkler

- [NPM Package](https://www.npmjs.com/package/better-auth-metadata)
- [GitHub Repository](https://github.com/yourusername/better-auth-metadata)
- [Better Auth Docs](https://better-auth.com)

## 📧 Destek

Sorularınız için:
- GitHub Issues: [Issues](https://github.com/yourusername/better-auth-metadata/issues)
- NPM: [Package Page](https://www.npmjs.com/package/better-auth-metadata)
