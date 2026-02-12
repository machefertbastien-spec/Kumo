/**
 * PercentileChart - OMS Percentile Growth Chart
 * Interactive chart showing WHO percentile curves with baby measurements
 * Scrollable horizontally for detailed view
 */

import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, Pressable, ScrollView } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText, G, Rect } from 'react-native-svg';
import { format, differenceInDays } from 'date-fns';
import { parseISODate } from '../../utils/dateUtils';
import { fr } from 'date-fns/locale';
import { getRefPack } from '../../features/growth/ref/refData';
import type { Sex, Metric, Bands } from '../../features/growth/types';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  p3_97: '#BC1F3C',
  p5_95: '#E56B3F',
  p10_90: '#F1A64D',
  p25_75: '#79C56A',
  p50: '#2A9A62',
  measurement: '#D48A63', // Points de mesure - terracotta
};

const PERCENTILE_CURVES: Array<{
  key: keyof Bands;
  percentile: number;
  color: string;
  strokeWidth?: number;
}> = [
  { key: 'p3', percentile: 3, color: THEME.p3_97 },
  { key: 'p5', percentile: 5, color: THEME.p5_95 },
  { key: 'p10', percentile: 10, color: THEME.p10_90 },
  { key: 'p25', percentile: 25, color: THEME.p25_75 },
  { key: 'p50', percentile: 50, color: THEME.p50, strokeWidth: 2.5 },
  { key: 'p75', percentile: 75, color: THEME.p25_75 },
  { key: 'p90', percentile: 90, color: THEME.p10_90 },
  { key: 'p95', percentile: 95, color: THEME.p5_95 },
  { key: 'p97', percentile: 97, color: THEME.p3_97 },
];

const PERCENTILE_LEGEND = [
  { label: '3/97 %', color: THEME.p3_97 },
  { label: '5/95 %', color: THEME.p5_95 },
  { label: '10/90 %', color: THEME.p10_90 },
  { label: '25/75 %', color: THEME.p25_75 },
  { label: '50 %', color: THEME.p50 },
];

function interpolateBandValue(points: Array<{ day: number; value: number }>, day: number): number | null {
  if (!points.length) return null;
  const sorted = points.slice().sort((a, b) => a.day - b.day);
  if (day <= sorted[0].day) return sorted[0].value;
  if (day >= sorted[sorted.length - 1].day) return sorted[sorted.length - 1].value;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const next = sorted[i];
    if (day <= next.day) {
      const ratio = (day - prev.day) / (next.day - prev.day);
      return prev.value + (next.value - prev.value) * ratio;
    }
  }

  return null;
}

interface Measurement {
  id: string;
  value: number;
  measuredAt: string;
}

interface PercentileChartProps {
  measurements: Measurement[];
  sex: Sex;
  metric: Metric;
  birthDateISO: string;
  onEditMeasurement?: (measurementId: string) => void;
}

interface SelectedPoint {
  measurement: Measurement;
  ageDays: number;
  percentile: number;
  x: number;
  y: number;
}

export function PercentileChart({ 
  measurements, 
  sex, 
  metric, 
  birthDateISO,
  onEditMeasurement,
}: PercentileChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(1); // 1x, 2x, 3x zoom

  // Get WHO reference data for the baby's sex
  const refPack = useMemo(() => {
    try {
      return getRefPack(sex, metric);
    } catch (e) {
      console.warn('Failed to load ref data:', e);
      return null;
    }
  }, [sex, metric]);

  const bands = refPack?.bands;

  // Chart dimensions
  const screenWidth = Dimensions.get('window').width;
  const baseChartWidth = screenWidth - 48;
  const chartWidth = baseChartWidth * zoomLevel; // Largeur augmente avec le zoom
  const chartHeight = 280;
  const padding = { top: 25, right: 40, bottom: 35, left: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Data ranges (0-12 months = 0-365 days)
  const maxDay = 365;
  
  // Calculate value range from bands
  const valueRange = useMemo(() => {
    if (!bands) return { min: 45, max: 85 }; // Default for length

    const bandValues = PERCENTILE_CURVES.flatMap(({ key }) => {
      const points = bands[key] ?? [];
      return points.filter((p) => p.day <= maxDay).map((p) => p.value);
    });
    const measurementValues = measurements.map(m => m.value);

    const allValues = [...bandValues, ...measurementValues];
    const min = Math.min(...allValues) - 2;
    const max = Math.max(...allValues) + 2;

    return { min, max };
  }, [bands, measurements]);

  // Scale functions
  const scaleX = (day: number) => padding.left + (day / maxDay) * plotWidth;
  const scaleY = (value: number) => {
    const range = valueRange.max - valueRange.min;
    return padding.top + plotHeight - ((value - valueRange.min) / range) * plotHeight;
  };

  // Create smooth path from points
  const createPath = (points: { day: number; value: number }[]) => {
    if (points.length === 0) return '';
    const filtered = points.filter(p => p.day <= maxDay).sort((a, b) => a.day - b.day);
    if (filtered.length === 0) return '';
    
    let path = `M ${scaleX(filtered[0].day)} ${scaleY(filtered[0].value)}`;
    for (let i = 1; i < filtered.length; i++) {
      path += ` L ${scaleX(filtered[i].day)} ${scaleY(filtered[i].value)}`;
    }
    return path;
  };

  // Calculate age in days for each measurement
  const measurementsWithAge = useMemo(() => {
    const birthDate = parseISODate(birthDateISO);
    return measurements.map(m => ({
      ...m,
      ageDays: differenceInDays(new Date(m.measuredAt), birthDate),
    })).filter(m => m.ageDays >= 0 && m.ageDays <= maxDay)
      .sort((a, b) => a.ageDays - b.ageDays);
  }, [measurements, birthDateISO]);

  // Calculate percentile for a measurement
  const getPercentile = (value: number, ageDays: number): number => {
    if (!bands) return 50;

    const anchors = PERCENTILE_CURVES
      .map(({ key, percentile }) => ({
        percentile,
        value: interpolateBandValue(bands[key] ?? [], ageDays),
      }))
      .filter((item): item is { percentile: number; value: number } => item.value !== null)
      .sort((a, b) => a.value - b.value);

    if (anchors.length < 2) return 50;

    if (value <= anchors[0].value) {
      const next = anchors[1];
      const span = Math.max(0.001, next.value - anchors[0].value);
      const pSpan = next.percentile - anchors[0].percentile;
      return Math.max(0, anchors[0].percentile - ((anchors[0].value - value) / span) * pSpan);
    }

    if (value >= anchors[anchors.length - 1].value) {
      const prev = anchors[anchors.length - 2];
      const last = anchors[anchors.length - 1];
      const span = Math.max(0.001, last.value - prev.value);
      const pSpan = last.percentile - prev.percentile;
      return Math.min(100, last.percentile + ((value - last.value) / span) * pSpan);
    }

    for (let i = 1; i < anchors.length; i++) {
      const low = anchors[i - 1];
      const high = anchors[i];
      if (value <= high.value) {
        const ratio = (value - low.value) / (high.value - low.value || 1);
        return low.percentile + ratio * (high.percentile - low.percentile);
      }
    }

    return 50;
  };

  // Handle point press
  const handlePointPress = (m: typeof measurementsWithAge[0]) => {
    const percentile = getPercentile(m.value, m.ageDays);
    setSelectedPoint({
      measurement: m,
      ageDays: m.ageDays,
      percentile,
      x: scaleX(m.ageDays),
      y: scaleY(m.value),
    });
  };

  // Toggle zoom level
  const toggleZoom = () => {
    setZoomLevel(prev => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return 1;
    });
    setSelectedPoint(null);
  };

  // X-axis ticks (months) - more ticks when zoomed
  const xTicks = zoomLevel === 1 
    ? [0, 2, 4, 6, 8, 10, 12]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const xTickDays = xTicks.map(m => m * 30.44);

  // Y-axis ticks
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => 
    valueRange.min + ((valueRange.max - valueRange.min) * i) / (yTickCount - 1)
  );

  if (!bands) {
    return (
      <View style={{ 
        height: chartHeight, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: THEME.card,
        borderRadius: 16,
      }}>
        <Text style={{ color: THEME.muted }}>Données de référence non disponibles</Text>
      </View>
    );
  }

  const metricLabel = metric === 'length' ? 'Taille' : 'Poids';
  const metricUnit = metric === 'length' ? 'cm' : 'kg';

  return (
    <View style={{ backgroundColor: THEME.card, borderRadius: 16, padding: 12, overflow: 'hidden' }}>
      {/* Title */}
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '700', 
        color: THEME.text, 
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Courbe de croissance - {metricLabel}
      </Text>
      
      {/* Sex indicator */}
      <Text style={{ 
        fontSize: 11, 
        color: THEME.muted, 
        textAlign: 'center',
        marginBottom: 8,
      }}>
        Courbes OMS ({sex === 'female' ? 'Fille' : 'Garçon'})
      </Text>

      {/* Zoom button */}
      <Pressable
        onPress={toggleZoom}
        style={({ pressed }) => ({
          alignSelf: 'center',
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 16,
          backgroundColor: zoomLevel > 1 ? THEME.primary : (pressed ? THEME.line : '#E8D5C4'),
          marginBottom: 8,
        })}
      >
        <Text style={{ 
          fontSize: 12, 
          fontWeight: '700', 
          color: zoomLevel > 1 ? '#fff' : THEME.text,
        }}>
          🔍 Zoom {zoomLevel}x {zoomLevel < 3 ? '→' : '↺'}
        </Text>
      </Pressable>

      {/* Scrollable chart */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={zoomLevel > 1}
        style={{ marginHorizontal: -12 }}
        contentContainerStyle={{ paddingHorizontal: zoomLevel > 1 ? 0 : 12 }}
      >
        <Pressable onPress={() => setSelectedPoint(null)}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Background grid - horizontal lines */}
            {yTicks.map((value, i) => (
              <Line
                key={`y-grid-${i}`}
                x1={padding.left}
                y1={scaleY(value)}
                x2={chartWidth - padding.right}
                y2={scaleY(value)}
                stroke={THEME.line}
                strokeWidth="1"
              />
            ))}

            {/* X-axis grid lines */}
            {xTickDays.map((day, i) => (
              <Line
                key={`x-grid-${i}`}
                x1={scaleX(day)}
                y1={padding.top}
                x2={scaleX(day)}
                y2={chartHeight - padding.bottom}
                stroke={THEME.line}
                strokeWidth="1"
              />
            ))}

            {/* OMS percentile curves */}
            {PERCENTILE_CURVES.map(({ key, color, strokeWidth = 2 }) => (
              <Path
                key={`band-${String(key)}`}
                d={createPath(bands[key] ?? [])}
                stroke={color}
                strokeWidth={String(strokeWidth)}
                fill="none"
              />
            ))}

            {/* Y-axis labels */}
            {yTicks.map((value, i) => (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={scaleY(value) + 4}
                fontSize="10"
                fill={THEME.muted}
                textAnchor="end"
              >
                {value.toFixed(0)}
              </SvgText>
            ))}

            {/* X-axis labels (months) */}
            {xTicks.map((month, i) => (
              <SvgText
                key={`x-label-${i}`}
                x={scaleX(xTickDays[i])}
                y={chartHeight - padding.bottom + 16}
                fontSize="10"
                fill={THEME.muted}
                textAnchor="middle"
              >
                {month}m
              </SvgText>
            ))}

            {/* Unit label */}
            <SvgText
              x={padding.left - 8}
              y={padding.top - 10}
              fontSize="10"
              fill={THEME.muted}
              textAnchor="end"
            >
              {metricUnit}
            </SvgText>

            {/* Measurement line connecting points */}
            {measurementsWithAge.length > 1 && (
              <Path
                d={createPath(measurementsWithAge.map(m => ({
                  day: m.ageDays,
                  value: m.value,
                })))}
                stroke={THEME.measurement}
                strokeWidth="2.5"
                fill="none"
              />
            )}

            {/* Measurement points */}
            {measurementsWithAge.map((m, i) => (
              <G key={m.id}>
                {/* Touch area (larger invisible circle) */}
                <Circle
                  cx={scaleX(m.ageDays)}
                  cy={scaleY(m.value)}
                  r={18}
                  fill="transparent"
                  onPress={() => handlePointPress(m)}
                />
                {/* Visible point */}
                <Circle
                  cx={scaleX(m.ageDays)}
                  cy={scaleY(m.value)}
                  r={selectedPoint?.measurement.id === m.id ? 8 : 6}
                  fill={THEME.measurement}
                  stroke="#fff"
                  strokeWidth="2"
                  onPress={() => handlePointPress(m)}
                />
              </G>
            ))}

            {/* Selected point tooltip */}
            {selectedPoint && (
              <G>
                {/* Tooltip background */}
                <Rect
                  x={Math.min(selectedPoint.x - 50, chartWidth - padding.right - 100)}
                  y={Math.max(selectedPoint.y - 55, padding.top)}
                  width={100}
                  height={45}
                  rx={8}
                  fill={THEME.text}
                />
                {/* Tooltip text */}
                <SvgText
                  x={Math.min(selectedPoint.x, chartWidth - padding.right - 50)}
                  y={Math.max(selectedPoint.y - 38, padding.top + 17)}
                  fontSize="11"
                  fill="#fff"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {selectedPoint.measurement.value.toFixed(1)} {metricUnit}
                </SvgText>
                <SvgText
                  x={Math.min(selectedPoint.x, chartWidth - padding.right - 50)}
                  y={Math.max(selectedPoint.y - 23, padding.top + 32)}
                  fontSize="9"
                  fill="rgba(255,255,255,0.8)"
                  textAnchor="middle"
                >
                  {format(new Date(selectedPoint.measurement.measuredAt), 'd MMM yyyy', { locale: fr })}
                </SvgText>
              </G>
            )}
          </Svg>
        </Pressable>
      </ScrollView>

            {/* Legend */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 12, 
        marginTop: 12,
        flexWrap: 'wrap',
      }}>
        {PERCENTILE_LEGEND.map((item) => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ 
              width: 16, 
              height: 3, 
              backgroundColor: item.color,
              borderRadius: 2,
            }} />
            <Text style={{ fontSize: 11, color: THEME.muted }}>{item.label}</Text>
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ 
            width: 10, 
            height: 10, 
            borderRadius: 5, 
            backgroundColor: THEME.measurement,
          }} />
          <Text style={{ fontSize: 11, color: THEME.muted }}>Mesures</Text>
        </View>
      </View>

      {/* Tap hint */}
      {measurementsWithAge.length > 0 && !selectedPoint && (
        <Text style={{ 
          fontSize: 10, 
          color: THEME.muted, 
          textAlign: 'center', 
          marginTop: 8,
          fontStyle: 'italic',
        }}>
          Touchez un point pour voir les détails
        </Text>
      )}

      {/* Edit action */}
      {selectedPoint && onEditMeasurement && (
        <Pressable
          onPress={() => onEditMeasurement(selectedPoint.measurement.id)}
          style={({ pressed }) => ({
            marginTop: 10,
            alignSelf: 'center',
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: THEME.line,
            backgroundColor: pressed ? THEME.line : THEME.bg,
          })}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: THEME.text }}>
            Modifier cette mesure
          </Text>
        </Pressable>
      )}

      {/* Scroll hint when zoomed */}
      {zoomLevel > 1 && (
        <Text style={{ 
          fontSize: 10, 
          color: THEME.primary, 
          textAlign: 'center', 
          marginTop: 4,
        }}>
          ← Faites défiler pour voir plus →
        </Text>
      )}
    </View>
  );
}

