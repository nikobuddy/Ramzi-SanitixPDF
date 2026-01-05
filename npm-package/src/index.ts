/**
 * @sanitixpdf/duplicate-detector
 * A production-ready library for detecting and removing duplicate PDF files
 * 
 * @author Nisarga Lokhande
 * @license MIT
 */

export { DuplicatePDFProvider, useDuplicatePDFContext } from './context/DuplicatePDFContext';
export { DuplicatePDFDetector } from './core/Detector';
export { useDuplicatePDFDetector } from './hooks/useDuplicatePDFDetector';
export type { DetectionOptions, DetectionResult, DuplicateGroup, PDFFile } from './types';

// Default export
import { DuplicatePDFDetector } from './core/Detector';
export default DuplicatePDFDetector;

