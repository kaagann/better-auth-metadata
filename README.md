# better-auth-metadata

Type-safe metadata management plugin for [Better Auth](https://better-auth.com). Store and manage user metadata as JSON in the user table with full TypeScript support.

## Features

✅ **Type-safe**: Full TypeScript support with custom metadata types  
✅ **Flexible**: Define your own metadata structure  
✅ **Nested Updates**: Update nested fields using dot notation  
✅ **Merge Support**: Merge with existing metadata or replace completely  
✅ **Easy to Use**: Simple and intuitive API  
✅ **Server & Client**: Works on both server and client side

## Installation

```bash
npm install better-auth-metadata
# or
pnpm add better-auth-metadata
# or
yarn add better-auth-metadata
```

## Quick Start

### 1. Define Your Metadata Type

```typescript
// types.ts
export interface UserMetadata {
  theme: "light" | "dark" | "system";
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
  profile: {
    bio?: string;
    avatar?: string;
  };
}
```

### 2. Server Setup

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

### 3. Client Setup

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

### 4. Run Database Migration

The plugin adds a `metadata` column to your user table. Run your migration:

```bash
# Your Better Auth migration command
npm run migrate
```

## API Reference

### `setMetadata(data, options?)`

Set or update user metadata.

```typescript
// Replace all metadata
await authClient.setMetadata({
  metadata: {
    theme: "dark",
    preferences: {
      notifications: true,
      emailUpdates: false,
      language: "en",
    },
  },
  merge: false, // false = replace, true = merge
});

// Merge with existing metadata
await authClient.setMetadata({
  metadata: {
    theme: "light", // Only theme changes
  },
  merge: true, // Other fields are preserved
});
```

**Parameters:**
- `data.metadata`: Partial or full metadata object
- `data.merge`: Whether to merge with existing metadata (default: `true`)
- `options`: Additional fetch options

**Returns:** `{ data: { metadata: TMetadata, success: boolean }, error?: any }`

### `getMetadata(options?)`

Get the current user's metadata.

```typescript
const { data, error } = await authClient.getMetadata();

if (data.metadata) {
  console.log(data.metadata.theme);
  console.log(data.metadata.preferences);
}
```

**Returns:** `{ data: { metadata: TMetadata | null }, error?: any }`

### `updateMetadata(data, options?)`

Update a specific nested field using dot notation.

```typescript
// Update nested field
await authClient.updateMetadata({
  path: "preferences.notifications",
  value: false,
});

// Update deep nested field
await authClient.updateMetadata({
  path: "profile.socialLinks.github",
  value: "https://github.com/username",
});
```

**Parameters:**
- `data.path`: Dot notation path to the field
- `data.value`: New value for the field
- `options`: Additional fetch options

**Returns:** `{ data: { metadata: TMetadata, success: boolean }, error?: any }`

### `deleteMetadata(options?)`

Delete all metadata for the current user.

```typescript
const { data, error } = await authClient.deleteMetadata();

if (data.success) {
  console.log("Metadata deleted");
}
```

**Returns:** `{ data: { success: boolean }, error?: any }`

## Usage Examples

### React Component

```tsx
import { useState, useEffect } from "react";
import { authClient } from "./auth-client";
import type { UserMetadata } from "./types";

function UserSettings() {
  const [metadata, setMetadata] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetadata();
  }, []);

  async function loadMetadata() {
    const { data } = await authClient.getMetadata();
    setMetadata(data.metadata);
    setLoading(false);
  }

  async function updateTheme(theme: "light" | "dark" | "system") {
    const { data, error } = await authClient.setMetadata({
      metadata: { theme },
      merge: true,
    });

    if (!error && data.metadata) {
      setMetadata(data.metadata);
    }
  }

  async function toggleNotifications() {
    if (!metadata) return;

    const { data } = await authClient.updateMetadata({
      path: "preferences.notifications",
      value: !metadata.preferences.notifications,
    });

    if (data.metadata) {
      setMetadata(data.metadata);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Settings</h2>
      
      <select 
        value={metadata?.theme || "system"}
        onChange={(e) => updateTheme(e.target.value as any)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={metadata?.preferences.notifications || false}
          onChange={toggleNotifications}
        />
        Enable Notifications
      </label>
    </div>
  );
}
```

### Vue Composition API

```typescript
import { ref, onMounted } from "vue";
import { authClient } from "./auth-client";
import type { UserMetadata } from "./types";

export function useUserMetadata() {
  const metadata = ref<UserMetadata | null>(null);
  const loading = ref(true);

  async function load() {
    const { data } = await authClient.getMetadata();
    metadata.value = data.metadata;
    loading.value = false;
  }

  async function update(updates: Partial<UserMetadata>) {
    const { data } = await authClient.setMetadata({
      metadata: updates,
      merge: true,
    });
    if (data.metadata) {
      metadata.value = data.metadata;
    }
  }

  onMounted(load);

  return { metadata, loading, update };
}
```

### Next.js App Router

```typescript
// app/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateUserTheme(theme: "light" | "dark") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Use the metadata endpoint
  // or directly update via database
}
```

## Type Safety

The plugin provides full TypeScript support:

```typescript
// ✅ Type-safe
await authClient.setMetadata({
  metadata: {
    theme: "dark", // "light" | "dark" | "system"
  },
  merge: true,
});

// ❌ TypeScript error
await authClient.setMetadata({
  metadata: {
    theme: "blue", // Type error: not assignable
  },
  merge: true,
});

// ✅ Nested fields are type-safe
const { data } = await authClient.getMetadata();
if (data.metadata) {
  const theme = data.metadata.theme; // Type: "light" | "dark" | "system"
  const notifications = data.metadata.preferences.notifications; // Type: boolean
}
```

## Best Practices

### 1. Define Metadata Type Centrally

```typescript
// types.ts - use across your entire project
export interface UserMetadata {
  // your metadata structure
}
```

### 2. Use Merge Wisely

```typescript
// For partial updates, use merge: true
await authClient.setMetadata({
  metadata: { theme: "dark" },
  merge: true, // Other fields preserved
});

// For full replacement, use merge: false
await authClient.setMetadata({
  metadata: { /* complete metadata */ },
  merge: false,
});
```

### 3. Nested Updates

```typescript
// For single field updates, use updateMetadata
await authClient.updateMetadata({
  path: "preferences.notifications",
  value: false,
});

// For multiple fields, use setMetadata with merge
await authClient.setMetadata({
  metadata: {
    preferences: {
      notifications: false,
      emailUpdates: true,
    },
  },
  merge: true,
});
```

### 4. Error Handling

```typescript
const { data, error } = await authClient.setMetadata({
  metadata: { theme: "dark" },
  merge: true,
});

if (error) {
  console.error("Failed to update metadata:", error);
  // Handle error appropriately
  return;
}

// Success
console.log("Updated:", data.metadata);
```

## Limitations

- Metadata is stored as a JSON string, not suitable for very large data
- Sensitive information should not be stored in metadata
- Complex validation should be implemented separately if needed
- Query performance may degrade with very large metadata objects

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Your Name

## Links

- [Better Auth Documentation](https://better-auth.com)
- [GitHub Repository](https://github.com/yourusername/better-auth-metadata)
- [Issue Tracker](https://github.com/yourusername/better-auth-metadata/issues)
