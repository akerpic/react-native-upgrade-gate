import React, { createContext, useContext } from 'react';
import { VersionProviderProps } from './types';

const VersionContext = createContext<string | null>(null);

/**
 * Provides the current app version to all descendants.
 * Wrap your app root with this so UpgradeGate can auto-detect the version.
 *
 * ```tsx
 * <VersionProvider version="2.1.0">
 *   <App />
 * </VersionProvider>
 * ```
 */
export function VersionProvider({ version, children }: VersionProviderProps) {
  return (
    <VersionContext.Provider value={version}>
      {children}
    </VersionContext.Provider>
  );
}

/** Read the current app version from context. Returns null if no provider. */
export function useAppVersion(): string | null {
  return useContext(VersionContext);
}
