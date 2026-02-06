import AsyncStorage from '@react-native-async-storage/async-storage';
import { SleepPlannerSettings, DEFAULT_SLEEPPLANNER_SETTINGS } from '../constants/sleepplanner';

const STORAGE_KEY_PREFIX = 'sleepplanner_settings_';

/**
 * Load SleepPlanner settings for a specific baby
 */
export async function loadSleepPlannerSettings(babyId: string): Promise<SleepPlannerSettings> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${babyId}`;
    const json = await AsyncStorage.getItem(key);
    
    if (!json) {
      return { ...DEFAULT_SLEEPPLANNER_SETTINGS, babyId };
    }
    
    const parsed = JSON.parse(json);
    return { ...DEFAULT_SLEEPPLANNER_SETTINGS, ...parsed, babyId };
  } catch (error) {
    console.error('[SleepPlanner] Failed to load settings:', error);
    return { ...DEFAULT_SLEEPPLANNER_SETTINGS, babyId };
  }
}

/**
 * Save SleepPlanner settings for a specific baby
 */
export async function saveSleepPlannerSettings(settings: SleepPlannerSettings): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${settings.babyId}`;
    await AsyncStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.error('[SleepPlanner] Failed to save settings:', error);
    throw error;
  }
}

/**
 * Delete SleepPlanner settings for a baby
 */
export async function deleteSleepPlannerSettings(babyId: string): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${babyId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[SleepPlanner] Failed to delete settings:', error);
  }
}
