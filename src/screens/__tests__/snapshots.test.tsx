import React from 'react';
import { renderWithProviders } from '../../test-utils';
import { SleepPlannerScreen } from '../SleepPlannerScreen';
import { GrowthTabScreen } from '../GrowthTabScreen';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '22 janvier 2026'),
  differenceInDays: jest.fn(() => 30),
  addDays: jest.fn((date) => date),
  subDays: jest.fn((date) => date),
  startOfDay: jest.fn((date) => date),
  startOfWeek: jest.fn((date) => date),
  isSameDay: jest.fn(() => false),
}));

jest.mock('date-fns/locale', () => ({ fr: {} }));

jest.mock('../../hooks/useSleepPlanner', () => ({
  useSleepPlanner: jest.fn(() => ({
    result: null,
    settings: { analysisWindow: 7 },
    updateSettings: jest.fn(),
    quickAdjust: jest.fn(),
  })),
}));

jest.mock('../../features/growth', () => ({
  GrowthChartsScreen: () => null,
  AddMeasurementSheet: () => null,
}));

describe('Snapshot Tests', () => {
  describe('SleepPlannerScreen', () => {
    it('matches snapshot with no prediction', () => {
      const tree = renderWithProviders(
        <SleepPlannerScreen nowMs={Date.now()} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('GrowthTabScreen', () => {
    it('matches snapshot with no baby', () => {
      const tree = renderWithProviders(
        <GrowthTabScreen />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
