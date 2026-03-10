/**
 * Example: Using the useUpgradeCheck hook directly for full control.
 */
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  VersionProvider,
  useUpgradeCheck,
} from 'react-native-upgrade-gate';

function AppContent() {
  const { updateRequired, updateAvailable, currentVersion, minVersion, loading } =
    useUpgradeCheck({ minVersion: '2.0.0', latestVersion: '2.5.0' });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Checking for updates...</Text>
      </View>
    );
  }

  if (updateRequired) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Update Required</Text>
        <Text>
          Current: {currentVersion} | Required: {minVersion}
        </Text>
        <Button title="Update" onPress={() => {/* open store */}} />
      </View>
    );
  }

  if (updateAvailable) {
    return (
      <View style={styles.container}>
        <Text>A new version is available!</Text>
        <Button title="Update" onPress={() => {/* open store */}} />
        <Text style={styles.appContent}>Main app content here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appContent}>App is up to date! v{currentVersion}</Text>
    </View>
  );
}

export default function App() {
  return (
    <VersionProvider version="1.9.0">
      <AppContent />
    </VersionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  appContent: { fontSize: 18, marginTop: 20 },
});
