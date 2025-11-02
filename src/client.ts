import type { BetterAuthClientPlugin } from "better-auth/client";
import type { metadata } from "./index";
import type { BetterFetchOption } from "@better-fetch/fetch";

/**
 * Better Auth Metadata Client Plugin
 * 
 * Type-safe client-side plugin for metadata management.
 * 
 * @example
 * ```typescript
 * import { metadataClient } from "better-auth-metadata/client";
 * 
 * interface UserMetadata {
 *   theme: "light" | "dark";
 * }
 * 
 * export const authClient = createAuthClient({
 *   plugins: [metadataClient<UserMetadata>()]
 * });
 * 
 * // Usage
 * await authClient.setMetadata({
 *   metadata: { theme: "dark" },
 *   merge: true
 * });
 * ```
 */
export const metadataClient = <TMetadata extends Record<string, any> = Record<string, any>>() => {
  return {
    id: "metadata",
    $InferServerPlugin: {} as ReturnType<typeof metadata<TMetadata>>,
    getActions: ($fetch) => {
      return {
        /**
         * Set metadata for the current user
         * @param data - Metadata to set
         * @param options - Additional fetch options
         * @returns Promise with metadata and success status
         * 
         * @example
         * ```typescript
         * // Replace all metadata
         * await authClient.setMetadata({
         *   metadata: { theme: "dark" },
         *   merge: false
         * });
         * 
         * // Merge with existing metadata
         * await authClient.setMetadata({
         *   metadata: { theme: "dark" },
         *   merge: true
         * });
         * ```
         */
        setMetadata: async (
          data: {
            metadata: Partial<TMetadata>;
            merge?: boolean;
          },
          options?: BetterFetchOption
        ) => {
          const res = await $fetch<{
            metadata: TMetadata;
            success: boolean;
          }>("/metadata/set", {
            method: "POST",
            body: data,
            ...options,
          });

          return res;
        },

        /**
         * Get metadata for the current user
         * @param options - Additional fetch options
         * @returns Promise with metadata
         * 
         * @example
         * ```typescript
         * const { data, error } = await authClient.getMetadata();
         * if (data.metadata) {
         *   console.log(data.metadata.theme);
         * }
         * ```
         */
        getMetadata: async (options?: BetterFetchOption) => {
          const res = await $fetch<{
            metadata: TMetadata | null;
          }>("/metadata/get", {
            method: "GET",
            ...options,
          });

          return res;
        },

        /**
         * Update a specific field in metadata using dot notation
         * @param data - Path and value to update
         * @param options - Additional fetch options
         * 
         * @example
         * ```typescript
         * // Update nested field
         * await authClient.updateMetadata({
         *   path: "preferences.notifications",
         *   value: false
         * });
         * 
         * // Update deep nested field
         * await authClient.updateMetadata({
         *   path: "profile.socialLinks.github",
         *   value: "https://github.com/username"
         * });
         * ```
         */
        updateMetadata: async (
          data: {
            path: string;
            value: any;
          },
          options?: BetterFetchOption
        ) => {
          const res = await $fetch<{
            metadata: TMetadata;
            success: boolean;
          }>("/metadata/update", {
            method: "POST",
            body: data,
            ...options,
          });

          return res;
        },

        /**
         * Delete all metadata for the current user
         * @param options - Additional fetch options
         * 
         * @example
         * ```typescript
         * const { data, error } = await authClient.deleteMetadata();
         * if (data.success) {
         *   console.log("Metadata deleted");
         * }
         * ```
         */
        deleteMetadata: async (options?: BetterFetchOption) => {
          const res = await $fetch<{
            success: boolean;
          }>("/metadata/delete", {
            method: "POST",
            ...options,
          });

          return res;
        },
      };
    },
  } satisfies BetterAuthClientPlugin;
};

// Re-export types for convenience
export type { BetterAuthClientPlugin } from "better-auth/client";
