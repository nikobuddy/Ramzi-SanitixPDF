/**
 * PDF hashing utilities using PDF.js
 */

// Set up PDF.js worker (will be set when pdfjs-dist is loaded)
let workerInitialized = false;

async function initializePDFJS() {
  if (workerInitialized || typeof window === 'undefined') {
    return;
  }

  try {
    // @ts-ignore - pdfjs-dist will be available at runtime
    const pdfjsLib = await import('pdfjs-dist');
    if (pdfjsLib.GlobalWorkerOptions && pdfjsLib.version) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      workerInitialized = true;
    }
  } catch (e) {
    // PDF.js will be available at runtime
    console.warn('PDF.js not available, will use file hash only');
  }
}

interface HashOptions {
  compareText?: boolean;
  compareMetadata?: boolean;
}

export class PDFHasher {
  /**
   * Hash the file content directly (fast, for exact duplicates)
   */
  async hashFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Hash PDF content (text, metadata, etc.) - more thorough
   */
  async hashContent(file: File, options: HashOptions = {}): Promise<string> {
    const { compareText = true, compareMetadata = true } = options;
    
    try {
      // Initialize PDF.js if needed
      await initializePDFJS();
      
      // Dynamic import of pdfjs-dist
      // @ts-ignore - pdfjs-dist will be available at runtime
      const pdfjsLib = await import('pdfjs-dist');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let contentString = '';

      // Extract text from all pages
      if (compareText) {
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          contentString += pageText;
        }
      }

      // Extract metadata
      if (compareMetadata) {
        const metadata = await pdf.getMetadata();
        if (metadata.info) {
          contentString += JSON.stringify(metadata.info);
        }
        if (metadata.metadata) {
          contentString += JSON.stringify(metadata.metadata);
        }
      }

      // Add page count
      contentString += `pages:${pdf.numPages}`;

      // Hash the content string
      const encoder = new TextEncoder();
      const data = encoder.encode(contentString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      return this.bufferToHex(hashBuffer);
    } catch (error) {
      // Fallback to file hash if PDF parsing fails
      console.warn('PDF parsing failed, using file hash:', error);
      return this.hashFile(file);
    }
  }

  /**
   * Convert ArrayBuffer to hex string
   */
  private bufferToHex(buffer: ArrayBuffer): string {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

