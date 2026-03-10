declare const __DEV__: boolean;

/**
 * Parse a semver string into [major, minor, patch] numeric tuple.
 * Accepts formats like "1.2.3", "1.2", "1", with optional "v" prefix.
 * Pre-release suffixes (e.g. "-beta.1") are stripped before parsing.
 */
export function parseSemver(version: string): [number, number, number] {
  const cleaned = version.replace(/^v/, '').split('-')[0];
  const parts = cleaned.split('.').map(Number);

  if (__DEV__) {
    if (parts.some(isNaN)) {
      console.warn(
        `[react-native-upgrade-gate] Invalid version string: "${version}". ` +
          'Expected a semver format like "1.2.3".',
      );
    }
  }

  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

/**
 * Compare two semver strings.
 * Returns:
 *  -1 if a < b
 *   0 if a === b
 *   1 if a > b
 */
export function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const [aMajor, aMinor, aPatch] = parseSemver(a);
  const [bMajor, bMinor, bPatch] = parseSemver(b);

  if (aMajor !== bMajor) return aMajor < bMajor ? -1 : 1;
  if (aMinor !== bMinor) return aMinor < bMinor ? -1 : 1;
  if (aPatch !== bPatch) return aPatch < bPatch ? -1 : 1;
  return 0;
}

/**
 * Returns true if `current` is less than `minimum`.
 */
export function isVersionBelow(current: string, minimum: string): boolean {
  return compareSemver(current, minimum) === -1;
}
