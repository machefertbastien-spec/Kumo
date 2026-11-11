import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import PostHog from 'posthog-react-native';

export type KumoAnalyticsEvent =
  | 'app opened'
  | 'tracking_entry_saved'
  | 'tracking_first_entry_added';

const FIRST_ENTRY_MARKER = '@kumo/analytics/first-entry-v1';
const APP_ID = 'kumo';
const ANALYTICS_SCHEMA_VERSION = 1;

let client: PostHog | null | undefined;
let configurationWarningShown = false;

const getConfiguration = () => {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim();
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim();
  const environment = process.env.EXPO_PUBLIC_APP_ENVIRONMENT?.trim();
  const consentGranted = process.env.EXPO_PUBLIC_POSTHOG_CONSENT_GRANTED === 'true';

  return {
    apiKey,
    host,
    environment,
    enabled: Boolean(apiKey && host && environment === 'preview' && consentGranted),
  };
};

const warnAboutMissingPreviewConfiguration = () => {
  if (configurationWarningShown || typeof __DEV__ === 'undefined' || !__DEV__) return;
  configurationWarningShown = true;

  for (const variableName of ['EXPO_PUBLIC_POSTHOG_KEY', 'EXPO_PUBLIC_POSTHOG_HOST']) {
    if (!process.env[variableName]?.trim()) {
      console.error(
        new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
        ),
      );
    }
  }
};

const getClient = (): PostHog | null => {
  if (client !== undefined) return client;

  const configuration = getConfiguration();
  if (!configuration.enabled || !configuration.apiKey || !configuration.host) {
    warnAboutMissingPreviewConfiguration();
    client = null;
    return client;
  }

  client = new PostHog(configuration.apiKey, {
    host: configuration.host,
    captureAppLifecycleEvents: false,
    disableGeoip: true,
    enableSessionReplay: false,
    preloadFeatureFlags: false,
    sendFeatureFlagEvent: false,
    persistence: 'memory',
    flushAt: 1,
    flushInterval: 1000,
  });

  return client;
};

export const buildSafeEventProperties = () => ({
  app_id: APP_ID,
  app_platform: 'mobile',
  app_environment: 'preview',
  analytics_schema_version: ANALYTICS_SCHEMA_VERSION,
  app_version: Application.nativeApplicationVersion ?? 'unknown',
  platform: Platform.OS,
  $process_person_profile: false,
});

export const captureKumoEvent = (event: KumoAnalyticsEvent) => {
  try {
    getClient()?.capture(event, buildSafeEventProperties());
  } catch {
    // Analytics must never interrupt the local-first product flow.
  }
};

export const captureTrackingEntrySaved = async () => {
  captureKumoEvent('tracking_entry_saved');

  try {
    const existingMarker = await AsyncStorage.getItem(FIRST_ENTRY_MARKER);
    if (existingMarker) return;

    await AsyncStorage.setItem(FIRST_ENTRY_MARKER, '1');
    captureKumoEvent('tracking_first_entry_added');
  } catch {
    // A local analytics marker failure must not affect the saved baby event.
  }
};
