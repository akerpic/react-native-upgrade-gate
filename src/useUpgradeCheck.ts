import { useState, useEffect, useCallback } from 'react';
import { isVersionBelow } from './version';
import { useAppVersion } from './VersionContext';
import type { UpgradeCheckResult, RemoteUpgradeConfig } from './types';

export interface UseUpgradeCheckOptions {
  /** Minimum required version (static). */
  minVersion?: string;
  /** Latest available version (static, for optional update detection). */
  latestVersion?: string;
  /** Override the current app version. Falls back to VersionProvider, then "0.0.0". */
  currentVersion?: string;
  /** URL to fetch remote config. When provided, overrides static minVersion/latestVersion. */
  remoteConfigUrl?: string;
}

/**
 * Hook that checks whether the current app version meets the minimum requirement.
 *
 * ```ts
 * const { updateRequired, updateAvailable, loading } = useUpgradeCheck({
 *   minVersion: '1.5.0',
 * });
 * ```
 */
export function useUpgradeCheck(options: UseUpgradeCheckOptions): UpgradeCheckResult {
  const contextVersion = useAppVersion();
  const currentVersion = options.currentVersion ?? contextVersion ?? '0.0.0';

  const [remoteConfig, setRemoteConfig] = useState<RemoteUpgradeConfig | null>(null);
  const [loading, setLoading] = useState(!!options.remoteConfigUrl);
  const [error, setError] = useState<Error | undefined>();

  const fetchConfig = useCallback(async () => {
    if (!options.remoteConfigUrl) return;
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch(options.remoteConfigUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch upgrade config: ${response.status}`);
      }
      const data: RemoteUpgradeConfig = await response.json();
      setRemoteConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [options.remoteConfigUrl]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const minVersion = remoteConfig?.minVersion ?? options.minVersion ?? '0.0.0';
  const latestVersion = remoteConfig?.latestVersion ?? options.latestVersion;

  const updateRequired = isVersionBelow(currentVersion, minVersion);
  const updateAvailable =
    !updateRequired && !!latestVersion && isVersionBelow(currentVersion, latestVersion);

  return {
    updateRequired,
    updateAvailable,
    currentVersion,
    minVersion,
    latestVersion,
    loading,
    error,
    remoteConfig: remoteConfig ?? undefined,
  };
}
