import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { sessionMiddleware } from "better-auth/api";
import { APIError } from "better-auth/api";

export interface MetadataPluginOptions<TMetadata extends Record<string, any> = Record<string, any>> {
  /**
   * Metadata type definition for type safety
   * @example
   * {
   *   theme: string,
   *   preferences: {
   *     notifications: boolean
   *   }
   * }
   */
  metadata?: TMetadata;
}

/**
 * Better Auth Metadata Plugin
 * 
 * Type-safe metadata management for Better Auth users.
 * Stores metadata as JSON in the user table.
 * 
 * @example
 * ```typescript
 * import { metadata } from "better-auth-metadata";
 * 
 * interface UserMetadata {
 *   theme: "light" | "dark";
 *   preferences: {
 *     notifications: boolean;
 *   };
 * }
 * 
 * export const auth = betterAuth({
 *   plugins: [metadata<UserMetadata>()]
 * });
 * ```
 */
export const metadata = <TMetadata extends Record<string, any> = Record<string, any>>(
  options?: MetadataPluginOptions<TMetadata>
) => {
  return {
    id: "metadata",
    schema: {
      user: {
        fields: {
          metadata: {
            type: "string",
            required: false,
          },
        },
      },
    },
    endpoints: {
      setMetadata: createAuthEndpoint(
        "/metadata/set",
        {
          method: "POST",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;
          
          if (!session?.user?.id) {
            throw new APIError("UNAUTHORIZED", {
              message: "User not authenticated",
            });
          }

          const body = await ctx.request.json();
          const { metadata: newMetadata, merge = true } = body as {
            metadata: Partial<TMetadata>;
            merge?: boolean;
          };

          const user = await ctx.context.adapter.findOne({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
          });

          let updatedMetadata: TMetadata;

          if (merge && user?.metadata) {
            const existingMetadata = JSON.parse(user.metadata as string);
            updatedMetadata = {
              ...existingMetadata,
              ...newMetadata,
            } as TMetadata;
          } else {
            updatedMetadata = newMetadata as TMetadata;
          }

          await ctx.context.adapter.update({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
            data: {
              metadata: JSON.stringify(updatedMetadata),
            },
          });

          return ctx.json({
            metadata: updatedMetadata,
            success: true,
          });
        }
      ),

      getMetadata: createAuthEndpoint(
        "/metadata/get",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;

          if (!session?.user?.id) {
            throw new APIError("UNAUTHORIZED", {
              message: "User not authenticated",
            });
          }

          const user = await ctx.context.adapter.findOne({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
          });

          const metadata = user?.metadata 
            ? JSON.parse(user.metadata as string) 
            : null;

          return ctx.json({
            metadata: metadata as TMetadata | null,
          });
        }
      ),

      updateMetadata: createAuthEndpoint(
        "/metadata/update",
        {
          method: "POST",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;

          if (!session?.user?.id) {
            throw new APIError("UNAUTHORIZED", {
              message: "User not authenticated",
            });
          }

          const body = await ctx.request.json();
          const { path, value } = body as {
            path: string;
            value: any;
          };

          const user = await ctx.context.adapter.findOne({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
          });

          let metadata = user?.metadata 
            ? JSON.parse(user.metadata as string) 
            : {};

          const keys = path.split(".");
          let current = metadata;
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          
          current[keys[keys.length - 1]] = value;

          await ctx.context.adapter.update({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
            data: {
              metadata: JSON.stringify(metadata),
            },
          });

          return ctx.json({
            metadata: metadata as TMetadata,
            success: true,
          });
        }
      ),

      deleteMetadata: createAuthEndpoint(
        "/metadata/delete",
        {
          method: "POST",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;

          if (!session?.user?.id) {
            throw new APIError("UNAUTHORIZED", {
              message: "User not authenticated",
            });
          }

          await ctx.context.adapter.update({
            model: "user",
            where: [
              {
                field: "id",
                value: session.user.id,
              },
            ],
            data: {
              metadata: null,
            },
          });

          return ctx.json({
            success: true,
          });
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
