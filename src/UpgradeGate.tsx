import React, { useState, useCallback, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useUpgradeCheck } from './useUpgradeCheck';
import { DefaultUpdateScreen } from './DefaultUpdateScreen';
import type { UpgradeGateProps, UpdateScreenContext, UpdateMode } from './types';

/**
 * Gate component that blocks rendering children when the app version
 * is below the configured minimum.
 *
 * ```tsx
 * <UpgradeGate
 *   minVersion="1.5.0"
 *   storeUrlIOS="https://apps.apple.com/app/your-app/id123456789"
 *   storeUrlAndroid="https://play.google.com/store/apps/details?id=com.yourapp"
 * >
 *   <App />
 * </UpgradeGate>
 * ```
 */
export function UpgradeGate({
  minVersion,
  latestVersion,
  mode = 'force',
  storeUrlIOS,
  storeUrlAndroid,
  remoteConfigUrl,
  currentVersion,
  renderForceUpdate,
  renderOptionalUpdate,
  renderLoading,
  onError,
  fallback,
  children,
}: UpgradeGateProps) {
  const check = useUpgradeCheck({
    minVersion,
    latestVersion,
    currentVersion,
    remoteConfigUrl,
  });

  const [dismissed, setDismissed] = useState(false);

  // Merge remote config values with props (remote takes precedence)
  const effectiveMode: UpdateMode = check.remoteConfig?.mode ?? mode;
  const effectiveStoreUrlIOS = check.remoteConfig?.storeUrlIOS ?? storeUrlIOS;
  const effectiveStoreUrlAndroid = check.remoteConfig?.storeUrlAndroid ?? storeUrlAndroid;
  const message = check.remoteConfig?.message;

  const storeUrl =
    Platform.OS === 'ios' ? effectiveStoreUrlIOS : effectiveStoreUrlAndroid;

  const openStore = useCallback(() => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {
        // Silently fail — the user may not have the store installed (rare).
      });
    }
  }, [storeUrl]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  // Notify consumer of fetch errors
  useEffect(() => {
    if (check.error && onError) {
      onError(check.error);
    }
  }, [check.error, onError]);

  // While loading remote config, show loading UI or null
  if (check.loading) {
    return renderLoading ? <>{renderLoading()}</> : null;
  }

  const context: UpdateScreenContext = {
    currentVersion: check.currentVersion,
    minVersion: check.minVersion,
    latestVersion: check.latestVersion,
    mode: effectiveMode,
    storeUrl,
    message,
    openStore,
    dismiss,
  };

  // Force update required
  if (check.updateRequired) {
    if (renderForceUpdate) {
      return <>{renderForceUpdate(context)}</>;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    return <DefaultUpdateScreen {...context} />;
  }

  // Optional update available
  if (check.updateAvailable && effectiveMode === 'optional' && !dismissed) {
    if (renderOptionalUpdate) {
      return <>{renderOptionalUpdate(context)}</>;
    }
    // Without a custom renderer for optional mode, fall through to children.
  }

  return <>{children}</>;
}
