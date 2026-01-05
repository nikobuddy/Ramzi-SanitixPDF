# @sanitixpdf/duplicate-detector

A production-ready React/JavaScript library for detecting and removing duplicate PDF files based on content comparison. Perfect for React applications that need to manage PDF files efficiently.

## Features

- 🔍 **Content-Based Detection**: Compares PDFs by actual content, not just filenames
- ⚡ **Fast & Efficient**: Uses SHA-256 hashing and PDF.js for content analysis
- 🎣 **React Hooks**: Easy-to-use React hooks for seamless integration
- 📊 **Real-time Progress**: Track detection progress with callbacks
- 🎯 **Multiple Strategies**: Choose how to handle duplicates (keep first, smallest, largest, etc.)
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🌐 **Browser Compatible**: Works in all modern browsers
- 🚀 **Production Ready**: Optimized and tested for production use

## Installation

```bash
npm install @sanitixpdf/duplicate-detector
# or
yarn add @sanitixpdf/duplicate-detector
# or
pnpm add @sanitixpdf/duplicate-detector
```

## Quick Start

### Using React Hook

```tsx
import React from 'react';
import { useDuplicatePDFDetector } from '@sanitixpdf/duplicate-detector';

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
import { DuplicatePDFProvider, useDuplicatePDFContext } from '@sanitixpdf/duplicate-detector';

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
import { DuplicatePDFDetector } from '@sanitixpdf/duplicate-detector';

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

- `method?: 'content' | 'hash' | 'hybrid'` - Detection method (default: 'hybrid')
- `compareText?: boolean` - Compare text content (default: true)
- `compareMetadata?: boolean` - Compare metadata (default: false)
- `keepStrategy?: 'first' | 'smallest' | 'largest' | 'newest' | 'oldest'` - Which file to keep (default: 'first')
- `autoDetect?: boolean` - Auto-detect when files are added (default: false)
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

Core class for duplicate detection.

```typescript
const detector = new DuplicatePDFDetector();
await detector.addFiles(fileList);
const result = await detector.detectDuplicates(options);
```

## Detection Methods

### Hash Method
Fast comparison using file hash. Best for exact duplicates.

```typescript
await detector.detectDuplicates({ method: 'hash' });
```

### Content Method
Thorough comparison using PDF content. Best for finding similar PDFs.

```typescript
await detector.detectDuplicates({
  method: 'content',
  compareText: true,
  compareMetadata: true,
});
```

### Hybrid Method (Recommended)
Uses both hash and content comparison for best accuracy.

```typescript
await detector.detectDuplicates({ method: 'hybrid' });
```

## Keep Strategies

Choose which file to keep when duplicates are found:

- `first` - Keep the first file added
- `smallest` - Keep the smallest file
- `largest` - Keep the largest file
- `newest` - Keep the newest file (by upload date)
- `oldest` - Keep the oldest file

## Examples

See the [examples directory](./examples) for complete React examples.

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

Requires browsers with support for:
- ES2020 features
- Web Crypto API
- File API

## TypeScript

Full TypeScript definitions are included. No additional `@types` package needed.

## License

MIT © [Nisarga Lokhande](https://github.com/nikobuddy)

## Repository

https://github.com/nikobuddy/Ramzi-SanitixPDF

## Support

- 🐛 [Report Bug](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)
- 💡 [Request Feature](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)

