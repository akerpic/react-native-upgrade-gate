/**
 * Example: Fetching upgrade config from a remote endpoint.
 *
 * The endpoint should return JSON matching RemoteUpgradeConfig:
 * {
 *   "minVersion": "2.0.0",
 *   "latestVersion": "2.3.1",
 *   "mode": "force",
 *   "storeUrlIOS": "https://apps.apple.com/app/...",
 *   "storeUrlAndroid": "https://play.google.com/store/apps/...",
 *   "message": "Please update to continue using the app."
 * }
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UpgradeGate, VersionProvider } from 'react-native-upgrade-gate';

function MyApp() {
  return (
    <View style={styles.container}>
      <Text>App Content</Text>
    </View>
  );
}

export default function App() {
  return (
    <VersionProvider version="1.8.0">
      <UpgradeGate
        remoteConfigUrl="https://api.example.com/app/upgrade-config"
        storeUrlIOS="https://apps.apple.com/app/your-app/id123456789"
        storeUrlAndroid="https://play.google.com/store/apps/details?id=com.yourapp"
      >
        <MyApp />
      </UpgradeGate>
    </VersionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
