/**
 * Example: Custom update screen with force and optional modes.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  UpgradeGate,
  VersionProvider,
  UpdateScreenContext,
} from 'react-native-upgrade-gate';

function CustomForceScreen({ currentVersion, minVersion, openStore }: UpdateScreenContext) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time to Update!</Text>
      <Text style={styles.body}>
        You're on v{currentVersion}, but v{minVersion} is now required.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openStore}>
        <Text style={styles.buttonText}>Go to Store</Text>
      </TouchableOpacity>
    </View>
  );
}

function CustomOptionalScreen({ openStore, dismiss }: UpdateScreenContext) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Version Available</Text>
      <TouchableOpacity style={styles.button} onPress={openStore}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={dismiss}>
        <Text style={styles.dismissText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

function MyApp() {
  return (
    <View style={styles.container}>
      <Text>App Content</Text>
    </View>
  );
}

export default function App() {
  return (
    <VersionProvider version="1.3.0">
      <UpgradeGate
        minVersion="1.2.0"
        latestVersion="1.5.0"
        mode="optional"
        storeUrlIOS="https://apps.apple.com/app/your-app/id123456789"
        storeUrlAndroid="https://play.google.com/store/apps/details?id=com.yourapp"
        renderForceUpdate={(ctx) => <CustomForceScreen {...ctx} />}
        renderOptionalUpdate={(ctx) => <CustomOptionalScreen {...ctx} />}
      >
        <MyApp />
      </UpgradeGate>
    </VersionProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  body: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  button: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dismissText: { color: '#007AFF', fontSize: 15 },
});
