export { UpgradeGate } from './UpgradeGate';
export { useUpgradeCheck } from './useUpgradeCheck';
export { VersionProvider, useAppVersion } from './VersionContext';
export { DefaultUpdateScreen } from './DefaultUpdateScreen';
export { compareSemver, isVersionBelow, parseSemver } from './version';

export type {
  UpdateMode,
  UpgradeCheckResult,
  UpgradeGateProps,
  UpdateScreenContext,
  RemoteUpgradeConfig,
  VersionProviderProps,
} from './types';

export type { UseUpgradeCheckOptions } from './useUpgradeCheck';
