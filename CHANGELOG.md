# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-02

### Added
- Initial release
- Type-safe metadata management for Better Auth
- Server-side plugin with 4 endpoints:
  - `setMetadata` - Set or merge user metadata
  - `getMetadata` - Retrieve user metadata
  - `updateMetadata` - Update nested fields using dot notation
  - `deleteMetadata` - Delete all user metadata
- Client-side plugin with full TypeScript support
- Support for custom metadata types
- Merge functionality for partial updates
- Dot notation support for nested field updates
- Comprehensive documentation and examples
- Full TypeScript type inference

### Features
- ✅ Type-safe API
- ✅ Server and client plugins
- ✅ Nested field updates
- ✅ Merge support
- ✅ Session middleware integration
- ✅ Better Auth ecosystem integration
