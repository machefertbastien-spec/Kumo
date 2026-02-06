import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage Utilities
 * Helper functions for AsyncStorage operations with JSON serialization
 */

/**
 * Load and parse JSON data from AsyncStorage
 * @param {string} key - Storage key
 * @param {*} fallback - Default value if key doesn't exist
 * @returns {Promise<*>} Parsed data or fallback value
 */
export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
}

/**
 * Save data to AsyncStorage as JSON
 * @param {string} key - Storage key
 * @param {*} value - Data to store (will be JSON stringified)
 * @returns {Promise<void>}
 */
export async function saveJson(key: string, value: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
}

/**
 * Safely parse JSON string with error handling
 * @param {string} text - JSON string to parse
 * @returns {{ok: boolean, value?: *, error?: string}} Result object
 */
export function safeParseJson(text: string): { ok: boolean; value?: any; error?: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: "JSON invalide" };
  }
}
