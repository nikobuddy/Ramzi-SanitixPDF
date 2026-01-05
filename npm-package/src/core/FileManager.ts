/**
 * File management utilities
 */


export class FileManager {
  /**
   * Validate if file is a PDF
   */
  isValidPDF(file: File): boolean {
    return (
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    );
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Create download link for file
   */
  createDownloadLink(file: File, filename?: string): string {
    const url = URL.createObjectURL(file);
    return url;
  }

  /**
   * Download file
   */
  downloadFile(file: File, filename?: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get file info
   */
  getFileInfo(file: File): {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
  } {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
    };
  }
}

