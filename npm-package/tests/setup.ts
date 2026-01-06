/**
 * Jest setup file
 */

// Polyfill for File.arrayBuffer in test environment
if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = async function() {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };
}

// Mock crypto.subtle if not available (for jsdom environment)
if (typeof global !== 'undefined' && !global.crypto) {
  global.crypto = {
    subtle: {
      digest: jest.fn(async (algorithm: string, data: ArrayBuffer) => {
        // Simple mock hash for testing
        const hash = new Uint8Array(32).fill(0);
        return hash.buffer;
      }),
    } as any,
  } as any;
}

// Mock PDF.js
jest.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: jest.fn(),
}));

