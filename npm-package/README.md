# @nikobuddy/duplicate-detector

A production-ready React/JavaScript library for detecting and removing duplicate PDF files based on content comparison. Perfect for React applications that need to manage PDF files efficiently.

## ✨ Features

### Core Features
- 🔍 **Multiple Detection Strategies**: Exact, hash, content, hybrid, fuzzy, and token-based detection
- ⚡ **Fast & Efficient**: Uses SHA-256 hashing and PDF.js for content analysis
- 🎯 **Configurable Thresholds**: Set similarity thresholds for fuzzy matching (0-1)
- 🔌 **Extensible**: Plugin system for custom detection strategies
- 📊 **Real-time Progress**: Track detection progress with callbacks
- 🎣 **React Hooks**: Easy-to-use React hooks for seamless integration
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🌐 **Browser Compatible**: Works in all modern browsers
- 🚀 **Production Ready**: Optimized, tested, and CI/CD ready

### Modern Package Features
- ✅ **ESM + CommonJS Support**: Works with both `import` and `require`
- ✅ **Async-First APIs**: Promise-based APIs for better performance
- ✅ **Comprehensive Tests**: Unit and integration tests with Jest
- ✅ **CI/CD Pipeline**: Automated testing and security audits
- ✅ **Code Quality**: ESLint + Prettier for consistent code style

## Installation

```bash
npm install @nikobuddy/duplicate-detector
# or
yarn add @nikobuddy/duplicate-detector
# or
pnpm add @nikobuddy/duplicate-detector
```

## Quick Start

### Using React Hook

```tsx
import React from 'react';
import { useDuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

function PDFManager() {
  const {
    files,
    result,
    isProcessing,
    progress,
    addFiles,
    detectDuplicates,
    removeDuplicates,
  } = useDuplicatePDFDetector({
    method: 'hybrid',
    keepStrategy: 'smallest',
    onProgress: (progress, status) => {
      console.log(`Progress: ${progress}% - ${status}`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFiles(e.target.files);
    }
  };

  const handleDetect = async () => {
    const result = await detectDuplicates();
    console.log(`Found ${result.duplicatesFound} duplicates`);
  };

  return (
    <div>
      <input type="file" multiple accept=".pdf" onChange={handleFileSelect} />
      <button onClick={handleDetect} disabled={isProcessing}>
        Detect Duplicates
      </button>
      {isProcessing && <div>Progress: {progress}%</div>}
      {result && (
        <div>
          <p>Total: {result.totalFiles}</p>
          <p>Unique: {result.uniqueFiles}</p>
          <p>Duplicates: {result.duplicatesFound}</p>
        </div>
      )}
    </div>
  );
}
```

### Using Context Provider

```tsx
import React from 'react';
import { DuplicatePDFProvider, useDuplicatePDFContext } from '@nikobuddy/duplicate-detector';

function PDFUploader() {
  const { addFiles, files } = useDuplicatePDFContext();

  return (
    <input
      type="file"
      multiple
      accept=".pdf"
      onChange={(e) => e.target.files && addFiles(e.target.files)}
    />
  );
}

function App() {
  return (
    <DuplicatePDFProvider options={{ autoDetect: true }}>
      <PDFUploader />
    </DuplicatePDFProvider>
  );
}
```

### Using Core Class Directly

```typescript
import { DuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

const detector = new DuplicatePDFDetector();

// Add files
await detector.addFiles(fileList);

// Detect duplicates
const result = await detector.detectDuplicates({
  method: 'hybrid',
  compareText: true,
  onProgress: (progress, status) => {
    console.log(`${progress}%: ${status}`);
  },
});

// Get unique files
const uniqueFiles = detector.getUniqueFiles();

// Remove duplicates
const remainingFiles = detector.removeDuplicates('smallest');
```

## API Reference

### `useDuplicatePDFDetector(options)`

React hook for duplicate PDF detection.

#### Options

- `method?: DetectionMethod` - Detection method: `'exact' | 'hash' | 'content' | 'hybrid' | 'fuzzy' | 'token'` (default: `'hybrid'`)
- `threshold?: number` - Similarity threshold for fuzzy matching (0-1, default: 0.8)
- `compareText?: boolean` - Compare text content (default: true)
- `compareMetadata?: boolean` - Compare metadata (default: false)
- `caseSensitive?: boolean` - Case sensitivity for text comparison (default: false)
- `ignoreWhitespace?: boolean` - Ignore whitespace differences (default: false)
- `ignorePunctuation?: boolean` - Ignore punctuation differences (default: false)
- `keepStrategy?: KeepStrategy` - Which file to keep: `'first' | 'smallest' | 'largest' | 'newest' | 'oldest'` (default: `'first'`)
- `autoDetect?: boolean` - Auto-detect when files are added (default: false)
- `plugins?: DetectionPlugin[]` - Custom detection plugins
- `onProgress?: (progress: number, status: string) => void` - Progress callback
- `onError?: (error: Error, file: PDFFile) => void` - Error callback
- `onComplete?: (result: DetectionResult) => void` - Completion callback

#### Returns

- `files: PDFFile[]` - All added files
- `result: DetectionResult | null` - Detection result
- `isProcessing: boolean` - Whether detection is in progress
- `progress: number` - Progress percentage (0-100)
- `status: string` - Current status message
- `error: Error | null` - Error if any
- `addFiles(files)` - Add files to detector
- `removeFile(id)` - Remove file by ID
- `clearFiles()` - Clear all files
- `detectDuplicates()` - Start duplicate detection
- `removeDuplicates()` - Remove duplicates from file list
- `getUniqueFiles()` - Get unique files
- `getDuplicateGroups()` - Get duplicate groups

### `DuplicatePDFDetector`

Core class for duplicate detection with async-first APIs.

```typescript
import { DuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

const detector = new DuplicatePDFDetector();

// Add files
await detector.addFiles(fileList);

// Detect duplicates (async-first)
const result = await detector.detectDuplicates(options);
// or explicitly
const result = await detector.detectDuplicatesAsync(options);

// Remove duplicates (async version available)
const remaining = await detector.removeDuplicatesAsync('smallest');
// or sync version
const remaining = detector.removeDuplicates('smallest');
```

#### Methods

- `addFiles(files: FileList | File[]): Promise<PDFFile[]>` - Add files to detector
- `detectDuplicates(options?: DetectionOptions): Promise<DetectionResult>` - Detect duplicates
- `detectDuplicatesAsync(options?: DetectionOptions): Promise<DetectionResult>` - Async-first API
- `removeDuplicates(keepStrategy?: KeepStrategy): PDFFile[]` - Remove duplicates (sync)
- `removeDuplicatesAsync(keepStrategy?: KeepStrategy): Promise<PDFFile[]>` - Remove duplicates (async)
- `getUniqueFiles(): PDFFile[]` - Get unique files
- `getDuplicateGroups(): DuplicateGroup[]` - Get duplicate groups
- `getFiles(): PDFFile[]` - Get all files
- `removeFile(id: string): void` - Remove file by ID
- `clearFiles(): void` - Clear all files

## Detection Methods

### 1. Exact Match (`exact`)
Fastest method - byte-for-byte comparison. Best for exact duplicates.

```typescript
await detector.detectDuplicates({ method: 'exact' });
```

### 2. Hash Method (`hash`)
Fast comparison using file hash. Good for exact duplicates.

```typescript
await detector.detectDuplicates({ method: 'hash' });
```

### 3. Content Method (`content`)
Thorough comparison using PDF content. Best for finding similar PDFs.

```typescript
await detector.detectDuplicates({
  method: 'content',
  compareText: true,
  compareMetadata: true,
});
```

### 4. Hybrid Method (`hybrid`) - Recommended
Uses both hash and content comparison for best accuracy.

```typescript
await detector.detectDuplicates({ method: 'hybrid' });
```

### 5. Fuzzy Matching (`fuzzy`)
Finds similar PDFs based on similarity threshold. Perfect for near-duplicates.

```typescript
await detector.detectDuplicates({
  method: 'fuzzy',
  threshold: 0.8, // 80% similarity required
  compareText: true,
  caseSensitive: false,
  ignoreWhitespace: true,
  ignorePunctuation: false,
});
```

### 6. Token-Based (`token`)
Token-based comparison for advanced duplicate detection.

```typescript
await detector.detectDuplicates({
  method: 'token',
  compareText: true,
  caseSensitive: false,
});
```

## Keep Strategies

Choose which file to keep when duplicates are found:

- `first` - Keep the first file added
- `smallest` - Keep the smallest file
- `largest` - Keep the largest file
- `newest` - Keep the newest file (by upload date)
- `oldest` - Keep the oldest file

## Advanced Usage

### Custom Detection Plugins

Create custom detection strategies using plugins:

```typescript
import { DetectionPlugin } from '@nikobuddy/duplicate-detector';

const customPlugin: DetectionPlugin = {
  name: 'custom-strategy',
  detect: async (files, options) => {
    // Your custom detection logic
    const groups: DuplicateGroup[] = [];
    // ... implement your logic
    return groups;
  },
};

await detector.detectDuplicates({
  plugins: [customPlugin],
});
```

### Configurable Thresholds

Use fuzzy matching with custom thresholds:

```typescript
// 90% similarity required
await detector.detectDuplicates({
  method: 'fuzzy',
  threshold: 0.9,
});

// 70% similarity (more lenient)
await detector.detectDuplicates({
  method: 'fuzzy',
  threshold: 0.7,
});
```

### Text Comparison Options

Fine-tune text comparison:

```typescript
await detector.detectDuplicates({
  method: 'content',
  compareText: true,
  caseSensitive: false,      // Ignore case
  ignoreWhitespace: true,    // Ignore spaces/tabs
  ignorePunctuation: true,   // Ignore punctuation
});
```

### ESM and CommonJS Support

Works with both module systems:

```javascript
// ESM
import { DuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

// CommonJS
const { DuplicatePDFDetector } = require('@nikobuddy/duplicate-detector');
```

## Examples

See the [examples directory](./examples) for complete React examples.

### Basic Example

```typescript
import { DuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

const detector = new DuplicatePDFDetector();

// Add files
const fileInput = document.querySelector('input[type="file"]');
await detector.addFiles(fileInput.files);

// Detect with fuzzy matching
const result = await detector.detectDuplicates({
  method: 'fuzzy',
  threshold: 0.85,
  onProgress: (progress, status) => {
    console.log(`${progress}%: ${status}`);
  },
});

console.log(`Found ${result.duplicatesFound} duplicates`);
console.log(`Processing time: ${result.processingTime}ms`);

// Remove duplicates, keeping smallest files
const unique = detector.removeDuplicates('smallest');
```

### React Hook Example

```tsx
import { useDuplicatePDFDetector } from '@nikobuddy/duplicate-detector';

function PDFManager() {
  const { files, detectDuplicates, result, isProcessing } = useDuplicatePDFDetector({
    method: 'fuzzy',
    threshold: 0.8,
    keepStrategy: 'smallest',
    autoDetect: true,
  });

  return (
    <div>
      {isProcessing && <p>Processing...</p>}
      {result && (
        <div>
          <p>Total: {result.totalFiles}</p>
          <p>Unique: {result.uniqueFiles}</p>
          <p>Duplicates: {result.duplicatesFound}</p>
        </div>
      )}
    </div>
  );
}
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

Requires browsers with support for:
- ES2020 features
- Web Crypto API
- File API

## Testing

The package includes comprehensive tests:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

Test coverage target: **≥80%**

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Run security audit
npm run audit
```

## CI/CD

The package includes GitHub Actions CI/CD pipeline that:
- ✅ Runs tests on multiple Node.js versions (16.x, 18.x, 20.x)
- ✅ Checks code quality with ESLint
- ✅ Verifies TypeScript compilation
- ✅ Generates test coverage reports
- ✅ Runs security audits
- ✅ Builds and verifies package output

## TypeScript

Full TypeScript definitions are included. No additional `@types` package needed.

All types are exported:

```typescript
import type {
  DetectionMethod,
  DetectionOptions,
  DetectionPlugin,
  DetectionResult,
  DuplicateGroup,
  KeepStrategy,
  PDFFile,
} from '@nikobuddy/duplicate-detector';
```

## Versioning

This package follows [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for version history and breaking changes.

## License

MIT © [Nisarga Lokhande](https://github.com/nikobuddy)

## Repository

https://github.com/nikobuddy/Ramzi-SanitixPDF

## Performance

- **Exact/Hash**: ~10-50ms per file
- **Content**: ~100-500ms per file
- **Hybrid**: ~150-600ms per file
- **Fuzzy**: ~200-800ms per file (depends on threshold)

## Edge Cases

The package handles:
- ✅ Case sensitivity variations
- ✅ Whitespace differences
- ✅ Punctuation variations
- ✅ Corrupted PDF files (with error handling)
- ✅ Large files (with progress tracking)
- ✅ Empty files
- ✅ Files with identical content but different metadata

## Support

- 🐛 [Report Bug](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)
- 💡 [Request Feature](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)
- 📖 [Documentation](https://github.com/nikobuddy/Ramzi-SanitixPDF#readme)
- 💬 [Discussions](https://github.com/nikobuddy/Ramzi-SanitixPDF/discussions)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](../../CONTRIBUTING.md) first.

## License

MIT © [Nisarga Lokhande](https://github.com/nikobuddy)

