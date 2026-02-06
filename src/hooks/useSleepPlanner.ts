import { useState, useEffect, useMemo } from 'react';
import { computeNextSleepPlan } from '../utils/sleepplannerAlgo';
import { loadSleepPlannerSettings, saveSleepPlannerSettings } from '../utils/sleepplannerStorage';
import { scheduleSleepPlannerNotification } from '../notifications/sleepplannerNotifications';
import { SleepPlannerSettings, SleepPlannerResult } from '../constants/sleepplanner';

/**
 * Hook to compute and manage SleepPlanner predictions
 */
export function useSleepPlanner(
  baby: any | null,
  events: any[],
  nowMs: number
): {
  result: SleepPlannerResult | null;
  settings: SleepPlannerSettings | null;
  updateSettings: (newSettings: Partial<SleepPlannerSettings>) => Promise<void>;
  quickAdjust: (minutesDelta: number) => Promise<void>;
} {
  const [settings, setSettings] = useState<SleepPlannerSettings | null>(null);
  
  // Load settings on mount
  useEffect(() => {
    if (!baby) return;
    
    loadSleepPlannerSettings(baby.id).then((loaded) => {
      setSettings(loaded);
    });
  }, [baby?.id]);
  
  // Compute SleepPlanner (memoized)
  const result = useMemo(() => {
    if (!baby || !settings) return null;
    
    const sleepEvents = events.filter((e) => e.type === 'sleep' && e.babyId === baby.id);
    return computeNextSleepPlan(baby, sleepEvents, settings, nowMs);
  }, [baby, events, settings, nowMs]);
  
  // Schedule notification when target changes
  useEffect(() => {
    if (!result?.window || !settings?.enableSleepPlannerNotif || !baby) return;
    
    scheduleSleepPlannerNotification(baby, result.window, settings);
  }, [result?.window?.targetMs, settings?.enableSleepPlannerNotif, baby?.id]);
  
  // Update settings function
  const updateSettings = async (newSettings: Partial<SleepPlannerSettings>) => {
    if (!settings) return;
    
    const updated = { ...settings, ...newSettings };
    await saveSleepPlannerSettings(updated);
    setSettings(updated);
  };
  
  // Quick adjust helper
  const quickAdjust = async (minutesDelta: number) => {
    if (!settings) return;
    
    const newNudge = Math.max(-15, Math.min(15, settings.nudgeMin + minutesDelta));
    await updateSettings({ nudgeMin: newNudge });
  };
  
  return { result, settings, updateSettings, quickAdjust };
}
