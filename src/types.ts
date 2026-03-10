import { ReactNode } from 'react';

/**
 * Update urgency level.
 * - "force": User cannot dismiss — must update to continue.
 * - "optional": User can dismiss and continue using the app.
 */
export type UpdateMode = 'force' | 'optional';

/** Result of a version comparison check. */
export interface UpgradeCheckResult {
  /** Whether an update is required (version < minVersion). */
  updateRequired: boolean;
  /** Whether an update is available but optional (version < latestVersion but >= minVersion). */
  updateAvailable: boolean;
  /** The current app version string. */
  currentVersion: string;
  /** The minimum required version. */
  minVersion: string;
  /** The latest available version, if provided. */
  latestVersion?: string;
  /** Whether the config is still loading (when using remote config). */
  loading: boolean;
  /** Error encountered while fetching remote config, if any. */
  error?: Error;
  /** The full remote config, if fetched successfully. */
  remoteConfig?: RemoteUpgradeConfig;
}

/** Remote config shape returned from a server endpoint. */
export interface RemoteUpgradeConfig {
  minVersion: string;
  latestVersion?: string;
  mode?: UpdateMode;
  storeUrlIOS?: string;
  storeUrlAndroid?: string;
  /** Optional message to display to the user. */
  message?: string;
}

/** Props for the UpgradeGate component. */
export interface UpgradeGateProps {
  /** Minimum app version required. Ignored when remoteConfigUrl is provided and loaded. */
  minVersion?: string;
  /** Latest available version (used for optional update prompts). */
  latestVersion?: string;
  /** Update mode. Defaults to "force". */
  mode?: UpdateMode;
  /** App Store URL for iOS. */
  storeUrlIOS?: string;
  /** Play Store URL for Android. */
  storeUrlAndroid?: string;
  /** URL to fetch remote upgrade config from. Takes precedence over static props. */
  remoteConfigUrl?: string;
  /**
   * Override the current app version (useful for testing).
   * If not provided, the version is read from the VersionProvider or defaults to "0.0.0".
   */
  currentVersion?: string;
  /** Custom component to render when an update is required (force mode). */
  renderForceUpdate?: (context: UpdateScreenContext) => ReactNode;
  /** Custom component to render when an optional update is available. */
  renderOptionalUpdate?: (context: UpdateScreenContext) => ReactNode;
  /** Shorthand: fallback component shown when a force update is required. */
  fallback?: ReactNode;
  /** Custom component to render while remote config is loading. Defaults to null (blank). */
  renderLoading?: () => ReactNode;
  /** Called when remote config fetch fails. */
  onError?: (error: Error) => void;
  /** Content to render when no update is required (or after dismissing optional). */
  children: ReactNode;
}

/** Context passed to custom update screen render functions. */
export interface UpdateScreenContext {
  currentVersion: string;
  minVersion: string;
  latestVersion?: string;
  mode: UpdateMode;
  storeUrl?: string;
  message?: string;
  /** Opens the appropriate store URL. */
  openStore: () => void;
  /** Dismiss the update screen (only works in "optional" mode). */
  dismiss: () => void;
}

/** Props for the VersionProvider that supplies the current app version. */
export interface VersionProviderProps {
  version: string;
  children: ReactNode;
}
