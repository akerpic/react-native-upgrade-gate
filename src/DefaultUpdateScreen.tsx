import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { UpdateScreenContext } from './types';

/**
 * Built-in update screen shown when no custom fallback is provided.
 * Designed to be functional and clean out of the box.
 */
export function DefaultUpdateScreen({
  currentVersion,
  minVersion,
  mode,
  message,
  openStore,
  dismiss,
}: UpdateScreenContext) {
  const title = mode === 'force' ? 'Update Required' : 'Update Available';
  const body =
    message ??
    (mode === 'force'
      ? `Your app version (${currentVersion}) is no longer supported. Please update to version ${minVersion} or later to continue.`
      : `A new version is available. Update to get the latest features and improvements.`);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        <TouchableOpacity style={styles.button} onPress={openStore} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Update Now</Text>
        </TouchableOpacity>

        {mode === 'optional' && (
          <TouchableOpacity style={styles.dismissButton} onPress={dismiss} activeOpacity={0.8}>
            <Text style={styles.dismissText}>Not Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  dismissText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
});
