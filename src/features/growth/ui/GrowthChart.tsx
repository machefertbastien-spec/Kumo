/**
 * Growth Chart Component
 * Interactive SVG chart showing WHO percentile curves and measurements
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { MeasurementWithStats, Bands, Metric } from '../types';
import { METRIC_UNITS, METRIC_LABELS } from '../types';

const THEME = {
  primary: '#D48A63',
  weight: '#D27C57',
  height: '#9FB59B',
  head: '#8FB9C3',
  lightGray: '#FBF8F6',
  mediumGray: '#EFE7E1',
  darkGray: '#7A6A60',
  text: '#4B3F39',
  percentile: '#E8D5C4',
};

interface GrowthChartProps {
  measurements: MeasurementWithStats[];
  bands: Bands;
  metric: Metric;
  childDob: string;
}

export function GrowthChart({ measurements, bands, metric, childDob }: GrowthChartProps) {
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementWithStats | null>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth * 2, 800); // Wide chart for scrolling
  const chartHeight = 320;
  const padding = { top: 30, right: 50, bottom: 50, left: 45 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Find data ranges
  const maxDay = 365;
  const allBandValues = [...bands.p3, ...bands.p15, ...bands.p50, ...bands.p85, ...bands.p97]
    .map(p => p.value);
  const measurementValues = measurements.map(m => m.measurement.value);
  const allValues = [...allBandValues, ...measurementValues];
  
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue;
  const valuePadding = valueRange * 0.1;

  // Scale functions
  const scaleX = (day: number) => padding.left + (day / maxDay) * plotWidth;
  const scaleY = (value: number) => 
    padding.top + plotHeight - ((value - minValue + valuePadding) / (valueRange + 2 * valuePadding)) * plotHeight;

  // Create path from points
  const createPath = (points: { day: number; value: number }[]) => {
    if (points.length === 0) return '';
    const sortedPoints = [...points].sort((a, b) => a.day - b.day);
    let path = `M ${scaleX(sortedPoints[0].day)} ${scaleY(sortedPoints[0].value)}`;
    for (let i = 1; i < sortedPoints.length; i++) {
      path += ` L ${scaleX(sortedPoints[i].day)} ${scaleY(sortedPoints[i].value)}`;
    }
    return path;
  };

  // Y-axis ticks
  const yTicks = 6;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => 
    minValue + (valueRange * i) / (yTicks - 1)
  );

  // X-axis ticks (months) - Show every 2 months to avoid overlap
  const xTicks = [0, 2, 4, 6, 8, 10, 12];
  const xTickDays = xTicks.map(m => m * 30);
  
  // Handle point click
  const handlePointPress = (measurement: MeasurementWithStats) => {
    setSelectedMeasurement(selectedMeasurement?.measurement.id === measurement.measurement.id ? null : measurement);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Background grid */}
            {yTickValues.map((value, i) => (
              <Line
                key={`y-grid-${i}`}
                x1={padding.left}
                y1={scaleY(value)}
                x2={chartWidth - padding.right}
                y2={scaleY(value)}
                stroke={THEME.mediumGray}
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
                stroke={THEME.mediumGray}
                strokeWidth="1"
              />
            ))}

            {/* Percentile curves */}
            <Path
              d={createPath(bands.p97)}
              stroke={THEME.percentile}
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d={createPath(bands.p85)}
              stroke={THEME.percentile}
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d={createPath(bands.p50)}
              stroke={THEME.primary}
              strokeWidth="2.5"
              fill="none"
            />
            <Path
              d={createPath(bands.p15)}
              stroke={THEME.percentile}
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d={createPath(bands.p3)}
              stroke={THEME.percentile}
              strokeWidth="1.5"
              fill="none"
            />

            {/* Percentile labels on right */}
            {[
              { band: bands.p97, label: '98%' },
              { band: bands.p85, label: '85%' },
              { band: bands.p50, label: '50%' },
              { band: bands.p15, label: '15%' },
              { band: bands.p3, label: '2%' },
            ].map(({ band, label }, i) => (
              <SvgText
                key={`percentile-${i}`}
                x={chartWidth - padding.right + 5}
                y={scaleY(band[band.length - 1].value) + 3}
                fontSize="9"
                fill={THEME.darkGray}
                textAnchor="start"
              >
                {label}
              </SvgText>
            ))}

            {/* Y-axis labels */}
            {yTickValues.map((value, i) => (
              <SvgText
                key={`y-label-${i}`}
                x={padding.left - 8}
                y={scaleY(value) + 4}
                fontSize="11"
                fill={THEME.darkGray}
                textAnchor="end"
              >
                {value.toFixed(1)}
              </SvgText>
            ))}

            {/* X-axis labels (months) */}
            {xTickDays.map((day, i) => (
              <SvgText
                key={`x-label-${i}`}
                x={scaleX(day)}
                y={chartHeight - padding.bottom + 18}
                fontSize="11"
                fill={THEME.darkGray}
                textAnchor="middle"
              >
                {xTicks[i]}m
              </SvgText>
            ))}

            {/* Measurement line connecting points */}
            {measurements.length > 1 && (
              <Path
                d={createPath(measurements.map(m => ({
                  day: m.ageDays,
                  value: m.measurement.value
                })))}
                stroke={metric === 'weight' ? THEME.weight : metric === 'height' ? THEME.height : THEME.head}
                strokeWidth="2.5"
                fill="none"
              />
            )}

            {/* Measurement points */}
            {measurements.map((m) => {
              const isSelected = selectedMeasurement?.measurement.id === m.measurement.id;
              const pointColor = metric === 'weight' ? THEME.weight : metric === 'height' ? THEME.height : THEME.head;
              return (
                <G key={m.measurement.id}>
                  <Circle
                    cx={scaleX(m.ageDays)}
                    cy={scaleY(m.measurement.value)}
                    r={isSelected ? 9 : 7}
                    fill={isSelected ? THEME.card : pointColor}
                    stroke={isSelected ? pointColor : THEME.card}
                    strokeWidth={isSelected ? 3 : 3}
                  />
                </G>
              );
            })}
          </Svg>
          
          {/* Touchable areas for points */}
          {measurements.map((m) => (
            <Pressable
              key={`touch-${m.measurement.id}`}
              style={{
                position: 'absolute',
                left: scaleX(m.ageDays) - 15,
                top: scaleY(m.measurement.value) - 15,
                width: 30,
                height: 30,
              }}
              onPress={() => handlePointPress(m)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Selected measurement info card */}
      {selectedMeasurement && (
        <View style={styles.infoCard}>
          <Pressable style={styles.closeButton} onPress={() => setSelectedMeasurement(null)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {format(new Date(selectedMeasurement.measurement.measuredAt), 'MMM dd, yyyy', { locale: fr })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{METRIC_LABELS[metric]}</Text>
            <Text style={styles.infoValueLarge}>
              {selectedMeasurement.measurement.value} {METRIC_UNITS[metric]}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Percentile</Text>
            <Text style={styles.infoPercentile}>
              {Math.round(selectedMeasurement.percentile)}%
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>
              {Math.floor(selectedMeasurement.ageDays / 30)}m {selectedMeasurement.ageDays % 30}d
            </Text>
          </View>
          
          <Text style={styles.infoSource}>Source: WHO</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: THEME.lightGray,
    borderRadius: 16,
    padding: 16,
    paddingTop: 40,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: THEME.darkGray,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: THEME.darkGray,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '600',
  },
  infoValueLarge: {
    fontSize: 18,
    color: THEME.text,
    fontWeight: '700',
  },
  infoPercentile: {
    fontSize: 16,
    color: THEME.primary,
    fontWeight: '700',
  },
  infoSource: {
    fontSize: 11,
    color: THEME.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
});
