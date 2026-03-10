/**
 * Example: Basic force-update gate with static config.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UpgradeGate, VersionProvider } from 'react-native-upgrade-gate';

function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the app!</Text>
    </View>
  );
}

export default function App() {
  return (
    <VersionProvider version="1.2.0">
      <UpgradeGate
        minVersion="1.5.0"
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
  text: { fontSize: 18 },
});
