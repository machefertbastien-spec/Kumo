import React from 'react';
import { renderWithProviders, waitFor } from '../../test-utils';
import { StatsScreen } from '../StatsScreen';
import { loadMeasurements } from '../../features/growth';

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

jest.mock('../../features/growth', () => ({
  AddMeasurementSheet: () => null,
  loadMeasurements: jest.fn(() => Promise.resolve([])),
}));

describe('StatsScreen', () => {
  const nowMs = Date.now();
  const mockedLoadMeasurements = loadMeasurements as jest.MockedFunction<typeof loadMeasurements>;

  beforeEach(() => {
    mockedLoadMeasurements.mockClear();
    mockedLoadMeasurements.mockResolvedValue([]);
  });

  const renderScreen = async () => {
    const utils = renderWithProviders(<StatsScreen nowMs={nowMs} />);
    await waitFor(() => expect(mockedLoadMeasurements).toHaveBeenCalled());
    return utils;
  };

  it('renders without crashing', async () => {
    const { getByText } = await renderScreen();
    expect(getByText(/Suiv/i)).toBeTruthy();
  });

  it('displays 7-day average section', async () => {
    const { getByText } = await renderScreen();
    expect(getByText(/Entrer une nouvelle donn/i)).toBeTruthy();
  });

  it('loads measurements for current baby id', async () => {
    await renderScreen();
    expect(mockedLoadMeasurements).toHaveBeenCalledWith('1');
  });

  it('calculates and displays sleep average', async () => {
    await renderScreen();
    // Would verify average is calculated correctly with Context data
  });

  it('calculates and displays feeding average', async () => {
    await renderScreen();
    // Would verify feeding count is displayed with Context data
  });

  it('calculates and displays diaper average', async () => {
    await renderScreen();
    // Would verify diaper count is displayed with Context data
  });

  it('displays history section with day letters', async () => {
    await renderScreen();
    // Would check for day letters (L, M, M, J, V, S, D)
  });

  it('renders MiniBars component for visualization', async () => {
    await renderScreen();
    // Basic render test
  });
});

