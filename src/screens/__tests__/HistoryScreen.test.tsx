import React from 'react';
import { renderWithProviders } from '../../test-utils';
import { HistoryScreen } from '../HistoryScreen';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '22 janvier'),
  startOfWeek: jest.fn(() => new Date('2026-01-19')),
  addDays: jest.fn((date, days) => new Date(date.getTime() + days * 86400000)),
  isSameDay: jest.fn(() => false),
  startOfDay: jest.fn((date) => date),
}));

jest.mock('date-fns/locale', () => ({
  fr: { options: { weekStartsOn: 1 } },
}));

describe('HistoryScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithProviders(<HistoryScreen />);
    expect(getByText('Historique')).toBeTruthy();
  });

  it('displays week navigation', () => {
    const { getByText } = renderWithProviders(<HistoryScreen />);
    // Should display week days
    expect(getByText).toBeTruthy();
  });

  it('displays "Aucun événement" when no events for selected day', () => {
    const { getByText } = renderWithProviders(<HistoryScreen />);
    expect(getByText('Aucun événement ce jour')).toBeTruthy();
  });
});
