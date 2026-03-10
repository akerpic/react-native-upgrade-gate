# react-native-upgrade-gate

Enforce minimum app version requirements in React Native. Block outdated app versions and redirect users to the App Store / Play Store.

- Pure TypeScript — no native modules required
- Semver version comparison
- Force update and optional update modes
- Built-in update screen with full customization support
- Remote config support (fetch min version from your server)
- Works with both iOS and Android

## Installation

```bash
npm install react-native-upgrade-gate
# or
yarn add react-native-upgrade-gate
```

No native linking required. Works out of the box.

## Quick Start

### 1. Provide the current app version

Wrap your app with `VersionProvider` so the library knows the installed version:

```tsx
import { VersionProvider } from 'react-native-upgrade-gate';

export default function Root() {
  return (
    <VersionProvider version="1.2.0">
      <App />
    </VersionProvider>
  );
}
```

> **Tip:** Use `react-native-device-info` (`getVersion()`) to get the real installed version dynamically.

### 2. Add the UpgradeGate

```tsx
import { UpgradeGate, VersionProvider } from 'react-native-upgrade-gate';

function Root() {
  return (
    <VersionProvider version="1.2.0">
      <UpgradeGate
        minVersion="1.5.0"
        storeUrlIOS="https://apps.apple.com/app/your-app/id123456789"
        storeUrlAndroid="https://play.google.com/store/apps/details?id=com.yourapp"
      >
        <App />
      </UpgradeGate>
    </VersionProvider>
  );
}
```

If the user's version (`1.2.0`) is below `minVersion` (`1.5.0`), a built-in update screen is shown instead of `<App />`.

## API

### `<UpgradeGate>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minVersion` | `string` | — | Minimum required version (semver) |
| `latestVersion` | `string` | — | Latest available version (for optional updates) |
| `mode` | `'force' \| 'optional'` | `'force'` | Update urgency |
| `storeUrlIOS` | `string` | — | App Store URL |
| `storeUrlAndroid` | `string` | — | Play Store URL |
| `remoteConfigUrl` | `string` | — | URL to fetch config from server |
| `currentVersion` | `string` | — | Override current version (for testing) |
| `fallback` | `ReactNode` | — | Static component for force update screen |
| `renderForceUpdate` | `(ctx: UpdateScreenContext) => ReactNode` | — | Render function for force update |
| `renderOptionalUpdate` | `(ctx: UpdateScreenContext) => ReactNode` | — | Render function for optional update |
| `renderLoading` | `() => ReactNode` | `null` | Component to show while fetching remote config |
| `onError` | `(error: Error) => void` | — | Called when remote config fetch fails |
| `children` | `ReactNode` | — | App content |

**Priority order** when update is required: `renderForceUpdate` > `fallback` > built-in `DefaultUpdateScreen`.

### `useUpgradeCheck(options)`

Hook for programmatic version checking:

```tsx
import { useUpgradeCheck } from 'react-native-upgrade-gate';

function MyComponent() {
  const {
    updateRequired,  // boolean — version < minVersion
    updateAvailable, // boolean — version < latestVersion (but >= minVersion)
    currentVersion,  // string
    minVersion,      // string
    latestVersion,   // string | undefined
    loading,         // boolean — true while fetching remote config
    error,           // Error | undefined
    remoteConfig,    // RemoteUpgradeConfig | undefined
  } = useUpgradeCheck({
    minVersion: '2.0.0',
    latestVersion: '2.5.0',
  });

  if (updateRequired) {
    return <ForceUpdateScreen />;
  }

  return <MainApp />;
}
```

### `UpdateScreenContext`

Passed to `renderForceUpdate` and `renderOptionalUpdate`:

```ts
interface UpdateScreenContext {
  currentVersion: string;
  minVersion: string;
  latestVersion?: string;
  mode: 'force' | 'optional';
  storeUrl?: string;
  message?: string;
  openStore: () => void;  // Opens the store URL via Linking
  dismiss: () => void;    // Dismiss the screen (optional mode only)
}
```

### Remote Config

Point `remoteConfigUrl` to an endpoint that returns JSON matching `RemoteUpgradeConfig`:

```json
{
  "minVersion": "2.0.0",
  "latestVersion": "2.3.1",
  "mode": "force",
  "storeUrlIOS": "https://apps.apple.com/app/...",
  "storeUrlAndroid": "https://play.google.com/store/apps/...",
  "message": "Please update to continue."
}
```

All fields from the remote config **take precedence** over props. This means you can control the update mode, store URLs, and messaging entirely from your server.

```tsx
<UpgradeGate
  remoteConfigUrl="https://api.example.com/upgrade-config"
  minVersion="1.0.0"
  storeUrlIOS="https://apps.apple.com/app/your-app/id123456789"
  storeUrlAndroid="https://play.google.com/store/apps/details?id=com.yourapp"
  renderLoading={() => <ActivityIndicator />}
  onError={(err) => console.warn('Config fetch failed:', err)}
>
  <App />
</UpgradeGate>
```

> **Tip:** Always provide a static `minVersion` alongside `remoteConfigUrl` as a fallback. If the fetch fails, the static value is used.

### Custom Update Screen

Use `renderForceUpdate` for full control over the update UI:

```tsx
<UpgradeGate
  minVersion="2.0.0"
  renderForceUpdate={({ currentVersion, minVersion, openStore }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>You need to update from {currentVersion} to {minVersion}</Text>
      <Button title="Update" onPress={openStore} />
    </View>
  )}
>
  <App />
</UpgradeGate>
```

Or use the `fallback` shorthand for a static component (no access to context):

```tsx
<UpgradeGate minVersion="2.0.0" fallback={<MyCustomScreen />}>
  <App />
</UpgradeGate>
```

### Optional Update

Show a dismissible prompt when a newer version is available but the current version still meets the minimum:

```tsx
<UpgradeGate
  minVersion="1.0.0"
  latestVersion="2.0.0"
  mode="optional"
  renderOptionalUpdate={({ openStore, dismiss }) => (
    <View>
      <Text>A new version is available!</Text>
      <Button title="Update" onPress={openStore} />
      <Button title="Not now" onPress={dismiss} />
    </View>
  )}
>
  <App />
</UpgradeGate>
```

### Utility Functions

```ts
import { compareSemver, isVersionBelow, parseSemver } from 'react-native-upgrade-gate';

compareSemver('1.2.0', '1.5.0'); // -1
compareSemver('2.0.0', '1.0.0'); // 1
compareSemver('1.0.0', '1.0.0'); // 0

isVersionBelow('1.2.0', '1.5.0'); // true
isVersionBelow('2.0.0', '1.5.0'); // false

parseSemver('v2.1.3-beta.1'); // [2, 1, 3]
```

## Exported Types

```ts
import type {
  UpdateMode,
  UpgradeCheckResult,
  UpgradeGateProps,
  UpdateScreenContext,
  RemoteUpgradeConfig,
  VersionProviderProps,
  UseUpgradeCheckOptions,
} from 'react-native-upgrade-gate';
```

## Production Tips

- **Get the real app version** using `react-native-device-info` (`getVersion()`) and pass it to `VersionProvider`.
- **Use remote config** so you can change the minimum version without shipping an app update.
- **Always set a static `minVersion` fallback** alongside `remoteConfigUrl` in case the network request fails.
- **Use `onError`** to log remote config failures to your analytics/crash reporting.
- **Add analytics** in your custom update screen to track how many users see the gate.
- **A/B test** optional vs. force update strategies using your remote config endpoint.

## Requirements

- React >= 16.8.0
- React Native >= 0.60.0
- No native modules or linking required

## License

MIT
