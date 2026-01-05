/**
 * React Context for duplicate PDF detection
 */

// @ts-ignore - React will be available as peer dependency
import React, { ReactNode, createContext, useContext } from 'react';
import { UseDuplicatePDFDetectorOptions, UseDuplicatePDFDetectorReturn } from '../types';

import { useDuplicatePDFDetector } from '../hooks/useDuplicatePDFDetector';

interface DuplicatePDFContextValue extends UseDuplicatePDFDetectorReturn {}

const DuplicatePDFContext = createContext<DuplicatePDFContextValue | undefined>(undefined);

interface DuplicatePDFProviderProps {
  children: ReactNode;
  options?: UseDuplicatePDFDetectorOptions;
}

export function DuplicatePDFProvider({
  children,
  options,
}: DuplicatePDFProviderProps) {
  const value = useDuplicatePDFDetector(options);

  return (
    <DuplicatePDFContext.Provider value={value}>
      {children}
    </DuplicatePDFContext.Provider>
  );
}

export function useDuplicatePDFContext(): DuplicatePDFContextValue {
  const context = useContext(DuplicatePDFContext);
  
  if (context === undefined) {
    throw new Error(
      'useDuplicatePDFContext must be used within a DuplicatePDFProvider'
    );
  }
  
  return context;
}

