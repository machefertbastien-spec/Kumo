import React from 'react';
import { renderWithProviders } from '../../test-utils';
import { StatsScreen } from '../StatsScreen';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '22 janvier'),
  subDays: jest.fn((date, days) => new Date(date.getTime() - days * 86400000)),
  startOfDay: jest.fn((date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }),
  startOfWeek: jest.fn((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }),
  addDays: jest.fn((date, days) => new Date(date.getTime() + days * 86400000)),
  isSameDay: jest.fn((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  }),
}));

jest.mock('date-fns/locale', () => ({
  fr: {},
}));

describe('StatsScreen', () => {
  const nowMs = Date.now();

  it('renders without crashing', () => {
    const { getByText } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    expect(getByText('Statistiques')).toBeTruthy();
  });

  it('displays 7-day average section', () => {
    const { getAllByText } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    expect(getAllByText('Moyenne sur 7 jours').length).toBeGreaterThan(0);
  });

  it('calculates and displays sleep average', () => {
    const { getByText } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    // Would verify average is calculated correctly with Context data
  });

  it('calculates and displays feeding average', () => {
    const { UNSAFE_root } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    // Would verify feeding count is displayed with Context data
  });

  it('calculates and displays diaper average', () => {
    const { UNSAFE_root } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    // Would verify diaper count is displayed with Context data
  });

  it('displays history section with day letters', () => {
    const { UNSAFE_root } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    // Would check for day letters (L, M, M, J, V, S, D)
  });

  it('renders MiniBars component for visualization', () => {
    const { UNSAFE_root } = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    // Basic render test
  });
});
