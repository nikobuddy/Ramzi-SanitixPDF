/**
 * Jest setup file
 */

// Polyfill for TextEncoder/TextDecoder if not available
if (typeof global !== 'undefined') {
  if (!global.TextEncoder) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
}

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
if (typeof global !== 'undefined' && (!global.crypto || !global.crypto.subtle)) {
  const mockDigest = async (_algorithm: string, data: ArrayBuffer): Promise<ArrayBuffer> => {
    // Create a simple hash based on data content for testing
    const view = new Uint8Array(data);
    const hash = new Uint8Array(32);
    // Simple hash: sum all bytes and distribute
    let sum = 0;
    for (let i = 0; i < view.length; i++) {
      sum += view[i];
    }
    // Fill hash with sum-based values
    for (let i = 0; i < 32; i++) {
      hash[i] = (sum + i) % 256;
    }
    return hash.buffer;
  };

  if (!global.crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.crypto = {
      subtle: {
        digest: mockDigest,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  } else if (!global.crypto.subtle) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.crypto.subtle = {
      digest: mockDigest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }
}

// Mock PDF.js with proper promise structure
jest.mock('pdfjs-dist', () => {
  const mockPDF = {
    numPages: 1,
    getPage: jest.fn(async () => ({
      getTextContent: jest.fn(async () => ({
        items: [{ str: 'test content' }],
      })),
    })),
    getMetadata: jest.fn(async () => ({
      info: { Title: 'Test PDF' },
      metadata: null,
    })),
  };

  return {
    GlobalWorkerOptions: {
      workerSrc: '',
    },
    getDocument: jest.fn(() => ({
      promise: Promise.resolve(mockPDF),
    })),
  };
});

