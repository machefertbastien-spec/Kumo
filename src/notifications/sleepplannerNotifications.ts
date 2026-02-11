import * as Notifications from 'expo-notifications';
import { SleepPlannerWindow, SleepPlannerSettings } from '../constants/sleepplanner';
import { saveSleepPlannerSettings } from '../utils/sleepplannerStorage';

const MIN_MS = 60 * 1000;

/**
 * Schedule SleepPlanner notification
 */
export async function scheduleSleepPlannerNotification(
  baby: any,
  window: SleepPlannerWindow,
  settings: SleepPlannerSettings
): Promise<void> {
  if (!settings.enableSleepPlannerNotif) return;
  
  try {
    // Cancel previous notification
    if (settings.lastNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(settings.lastNotificationId);
    }
    
    // Calculate trigger time
    const triggerMs = window.targetMs - settings.notifyBeforeMin * MIN_MS;
    const nowMs = Date.now();
    
    if (triggerMs <= nowMs) {
      // Already past trigger time, don't schedule
      return;
    }
    
    // Schedule new notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Créneau idéal pour ${baby.name || 'bébé'}`,
        body: `C'est bientôt le moment idéal pour ${window.slotType === 'bedtime' ? 'le coucher' : 'la sieste'} (dans ${settings.notifyBeforeMin} min)`,
        sound: true,
        data: {
          type: 'sweetspot',
          babyId: baby.id,
          targetMs: window.targetMs,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.round((triggerMs - nowMs) / 1000),
      },
    });
    
    // Save notification ID
    const updatedSettings = {
      ...settings,
      lastNotificationId: notificationId,
    };
    await saveSleepPlannerSettings(updatedSettings);
    
    console.log(`[SleepPlanner] Notification scheduled: ${notificationId} at ${new Date(triggerMs).toISOString()}`);
  } catch (error) {
    console.error('[SleepPlanner] Failed to schedule notification:', error);
  }
}

/**
 * Cancel SleepPlanner notification
 */
export async function cancelSleepPlannerNotification(settings: SleepPlannerSettings): Promise<void> {
  if (settings.lastNotificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(settings.lastNotificationId);
      console.log(`[SleepPlanner] Cancelled notification: ${settings.lastNotificationId}`);
    } catch (error) {
      console.error('[SleepPlanner] Failed to cancel notification:', error);
    }
  }
}
