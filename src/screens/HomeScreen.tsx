/**
 * HomeScreen - Main dashboard for baby tracking
 * New design with greeting header, metric cards, recent activities, and reading section
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SFIcon } from '../components/SFIcon';
import { AddSleepSheet, AddFeedingSheet, AddDiaperSheet, EventActionSheet } from '../components/sheets';
import { ALL_ARTICLE_PREVIEWS, type ArticlePreview } from '../content/aide';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ui';

/**
 * Get random articles from the help library
 */
const getRandomArticles = (count: number): ArticlePreview[] => {
  const shuffled = [...ALL_ARTICLE_PREVIEWS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Types
import type { Event, DiaperType } from '../types';

// Context
import { useBaby, useEvents, useSettings, useCaregiver } from '../contexts';

// Utils
import { agoShort, round1, msToHours } from '../utils/dateUtils';
import { calcSleepTotalBetween, diaperLabel } from '../utils/eventUtils';

// Constants
import { THEME } from '../constants/theme';

const DAY_MS = 86400000;

/**
 * Format sleep duration as hours and minutes
 */
const formatSleepDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m < 10 ? '0' : ''}${m}min`;
};

/**
 * Calculate total feeding amount in ml for today
 */
const calculateTotalFeedingMl = (events: any[]): number => {
  return events
    .filter((e) => e.type === 'feeding' && e.amountMl)
    .reduce((sum, e) => sum + (e.amountMl || 0), 0);
};

/**
 * HomeScreen Component
 * Main dashboard showing baby's current status and today's activities
 */
export function HomeScreen({ nowMs }: { nowMs: number }) {
  // Use context hooks
  const { baby } = useBaby();
  const { events, setEvents, logDiaper, logFeeding, startSleep, stopSleep, onOpenEditEvent } = useEvents();
  const { settings } = useSettings();
  const { caregiver } = useCaregiver();
  const navigation = useNavigation();

  // Add sleep sheet state
  const [showAddSleepSheet, setShowAddSleepSheet] = React.useState(false);
  const [showAddFeedingSheet, setShowAddFeedingSheet] = React.useState(false);
  const [showAddDiaperSheet, setShowAddDiaperSheet] = React.useState(false);
  
  // Event action sheet state
  const [showEventActionSheet, setShowEventActionSheet] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  
  // Reading section pagination
  const [activeArticleIndex, setActiveArticleIndex] = React.useState(0);

  // Random articles for reading section
  const randomArticles = useMemo(() => getRandomArticles(5), []);

  // Calculate today's time range
  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), []);
  const todayEnd = todayStart + DAY_MS;

  // Filter events for current baby
  const babyEvents = useMemo(() => {
    if (!baby) return [];
    return events
      .filter((e) => !e.deletedAt && e.babyId === baby.id)
      .slice()
      .sort((a, b) => b.ts - a.ts);
  }, [events, baby]);

  // Filter events for today
  const todayEvents = useMemo(() => {
    return babyEvents.filter((e) => {
      if (e.type === 'sleep') {
        const s = e.startTs ?? e.ts;
        const end = e.endTs ?? nowMs;
        return s < todayEnd && end > todayStart;
      }
      return e.ts >= todayStart && e.ts < todayEnd;
    });
  }, [babyEvents, todayStart, todayEnd, nowMs]);

  // Find ongoing sleep session
  const inProgressSleep = useMemo(
    () => babyEvents.find((e) => e.type === 'sleep' && !e.endTs) || null,
    [babyEvents]
  );

  // Calculate today's metrics
  const metrics = useMemo(() => {
    const sleepMs = calcSleepTotalBetween(todayEvents, todayStart, todayEnd);
    const sleepH = round1(msToHours(sleepMs));
    const feedingMl = calculateTotalFeedingMl(todayEvents);
    const diapers = todayEvents.filter((e) => e.type === 'diaper').length;
    return { sleepH, feedingMl, diapers };
  }, [todayEvents, todayStart, todayEnd]);

  // Get recent activities (top 3)
  const recentActivities = useMemo(() => {
    return todayEvents.slice(0, 3);
  }, [todayEvents]);

  // Format activity label
  const getActivityLabel = (e: any): string => {
    if (e.type === 'sleep') {
      if (e.endTs) {
        const duration = Math.round((e.endTs - (e.startTs ?? e.ts)) / 60000);
        return `Sommeil`;
      }
      return 'Sommeil en cours';
    }
    if (e.type === 'feeding') {
      return `Biberon`;
    }
    if (e.type === 'diaper') {
      return 'Couches';
    }
    return e.type;
  };

  const getActivityDetails = (e: any): string => {
    if (e.type === 'sleep') {
      const start = format(new Date(e.startTs ?? e.ts), 'HH:mm');
      const end = e.endTs ? format(new Date(e.endTs), 'HH:mm') : '...';
      return `${start} -> ${end}`;
    }
    if (e.type === 'feeding') {
      const time = format(new Date(e.ts), 'HH:mm');
      return `${e.amountMl || 0} ml - il y a ${agoShort(e.ts, nowMs)}`;
    }
    if (e.type === 'diaper') {
      const label = diaperLabel(e.diaperType ?? 'mixed');
      const time = format(new Date(e.ts), 'HH:mm');
      return `${label} - ${time}`;
    }
    return format(new Date(e.ts), 'HH:mm');
  };

  const getActivityIcon = (e: any): string => {
    if (e.type === 'sleep') return '🌙';
    if (e.type === 'feeding') return '🍼';
    if (e.type === 'diaper') return '🧷';
    return '📝';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      {/* Header with settings button */}
      <ScreenHeader showLogo />
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Title */}
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 16 }}>
          Comment va {baby?.name || 'Bébé'} aujourd'hui ?
        </Text>

        {/* Metric Cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {/* Sleep Card */}
          <Pressable
            onPress={() => setShowAddSleepSheet(true)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: '#A8B59B',
              borderRadius: 20,
              padding: 16,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>☁️</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: THEME.card, marginBottom: 2 }}>
              Sommeil
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.card }}>
              {formatSleepDuration(metrics.sleepH)}
            </Text>
          </Pressable>

          {/* Feeding Card */}
          <Pressable
            onPress={() => setShowAddFeedingSheet(true)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: '#E6A77D',
              borderRadius: 20,
              padding: 16,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🍼</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: THEME.card, marginBottom: 2 }}>
              Biberons
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.card }}>
              {metrics.feedingMl} ml
            </Text>
          </Pressable>

          {/* Diaper Card */}
          <Pressable
            onPress={() => setShowAddDiaperSheet(true)}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: '#E3B58F',
              borderRadius: 20,
              padding: 16,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🧷</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: THEME.card, marginBottom: 2 }}>
              Couches
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.card }}>
              {metrics.diapers}
            </Text>
          </Pressable>
        </View>

        {/* Recent Activities */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: THEME.text, marginBottom: 12 }}>
          Dernières activités
        </Text>
        
        {recentActivities.length === 0 ? (
          <View
            style={{
              backgroundColor: THEME.card,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: THEME.muted, fontWeight: '700' }}>
              Aucune activité aujourd'hui
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {recentActivities.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => {
                  setSelectedEvent(e);
                  setShowEventActionSheet(true);
                }}
                style={({ pressed }) => ({
                  backgroundColor: THEME.card,
                  borderRadius: 20,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: THEME.line,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{getActivityIcon(e)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: THEME.text }}>
                    {getActivityLabel(e)}
                  </Text>
                  <Text style={{ fontSize: 13, color: THEME.muted, marginTop: 2, fontWeight: '600' }}>
                    {getActivityDetails(e)}
                  </Text>
                </View>
                <SFIcon name="chevron.right" size={20} color={THEME.muted} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Reading Section */}
        <Text style={{ fontSize: 17, fontWeight: '800', color: THEME.text, marginTop: 24, marginBottom: 12 }}>
          A lire
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 16 }}
          onScroll={(e) => {
            const scrollX = e.nativeEvent.contentOffset.x;
            const cardWidth = 200 + 12; // card width + gap
            const index = Math.round(scrollX / cardWidth);
            setActiveArticleIndex(Math.min(Math.max(0, index), randomArticles.length - 1));
          }}
          scrollEventThrottle={16}
        >
          {randomArticles.map((article) => (
            <Pressable
              key={article.id}
              onPress={() => {
                (navigation as any).navigate('Aide', {
                  screen: 'ArticleDetail',
                  params: { articleId: article.id }
                });
              }}
              style={({ pressed }) => ({
                width: 200,
                backgroundColor: THEME.card,
                borderRadius: 20,
                padding: 16,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: article.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 20 }}>{article.illustration}</Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: THEME.text,
                  marginBottom: 6,
                  lineHeight: 20,
                }}
                numberOfLines={2}
              >
                {article.title}
              </Text>
              <Text style={{ fontSize: 12, color: THEME.muted, marginBottom: 8 }} numberOfLines={2}>
                {article.description}
              </Text>
              <Text style={{ fontSize: 11, color: THEME.muted, fontWeight: '700' }}>
                5 min de lecture
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 8 }}>
          {randomArticles.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeArticleIndex === index ? 10 : 6,
                height: activeArticleIndex === index ? 10 : 6,
                borderRadius: 5,
                backgroundColor: activeArticleIndex === index ? '#D48A63' : '#D9D9D9',
              }}
            />
          ))}
        </View>

        {/* Ask Kumo Banner */}
        <Pressable
          onPress={() => navigation.navigate('Kumo' as never)}
          style={({ pressed }) => ({
            marginTop: 20,
            borderRadius: 20,
            overflow: 'hidden',
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Image
            source={require('../../assets/AskKumo.png')}
            style={{ width: '100%', height: 120 }}
            resizeMode="cover"
          />
        </Pressable>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Sleep Sheet */}
      <AddSleepSheet
        visible={showAddSleepSheet}
        onClose={() => setShowAddSleepSheet(false)}
        onAdd={(params) => {
          // Combine date and time into timestamps
          const startTs = new Date(
            params.startDate.getFullYear(),
            params.startDate.getMonth(),
            params.startDate.getDate(),
            params.startTime.getHours(),
            params.startTime.getMinutes()
          ).getTime();

          const endTs = new Date(
            params.startDate.getFullYear(),
            params.startDate.getMonth(),
            params.startDate.getDate(),
            params.endTime.getHours(),
            params.endTime.getMinutes()
          ).getTime();

          // Create sleep event with startTs and endTs
          const sleepEvent: Event = {
            id: Date.now().toString(),
            type: 'sleep' as const,
            babyId: baby?.id || '',
            caregiverId: caregiver?.id || null,
            ts: startTs,
            startTs,
            endTs,
            note: params.type,
            updatedAt: Date.now(),
          };

          // Add the event
          setEvents(prev => [...prev, sleepEvent]);
          setShowAddSleepSheet(false);
        }}
      />

      {/* Add Feeding Sheet */}
      <AddFeedingSheet
        visible={showAddFeedingSheet}
        onClose={() => setShowAddFeedingSheet(false)}
        defaultAmount={settings.defaultFeedingAmountMl}
        onAdd={(params) => {
          // Combine date and time into timestamp
          const ts = new Date(
            params.date.getFullYear(),
            params.date.getMonth(),
            params.date.getDate(),
            params.time.getHours(),
            params.time.getMinutes()
          ).getTime();

          // Create feeding event
          const feedingEvent: Event = {
            id: Date.now().toString(),
            type: 'feeding' as const,
            babyId: baby?.id || '',
            caregiverId: caregiver?.id || null,
            ts,
            amountMl: params.amountMl,
            note: params.type,
            updatedAt: Date.now(),
          };

          // Add the event
          setEvents(prev => [...prev, feedingEvent]);
          setShowAddFeedingSheet(false);
        }}
      />

      {/* Add Diaper Sheet */}
      <AddDiaperSheet
        visible={showAddDiaperSheet}
        onClose={() => setShowAddDiaperSheet(false)}
        onAdd={(params) => {
          // Combine date and time into timestamp
          const ts = new Date(
            params.date.getFullYear(),
            params.date.getMonth(),
            params.date.getDate(),
            params.time.getHours(),
            params.time.getMinutes()
          ).getTime();

          // Create diaper event
          const diaperEvent: Event = {
            id: Date.now().toString(),
            type: 'diaper' as const,
            babyId: baby?.id || '',
            caregiverId: caregiver?.id || null,
            ts,
            diaperType: params.type as DiaperType,
            updatedAt: Date.now(),
          };

          // Add the event
          setEvents(prev => [...prev, diaperEvent]);
          setShowAddDiaperSheet(false);
        }}
      />

      {/* Event Action Sheet */}
      <EventActionSheet
        visible={showEventActionSheet}
        event={selectedEvent}
        onClose={() => {
          setShowEventActionSheet(false);
          setSelectedEvent(null);
        }}
        onEdit={(event) => {
          setShowEventActionSheet(false);
          setSelectedEvent(null);
          onOpenEditEvent(event);
        }}
        onDelete={(eventId) => {
          setEvents(prev => prev.map(e => 
            e.id === eventId ? { ...e, deletedAt: Date.now() } : e
          ));
          setShowEventActionSheet(false);
          setSelectedEvent(null);
        }}
      />
    </SafeAreaView>
  );
}




