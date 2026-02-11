import React from 'react';
import { renderWithProviders } from '../../test-utils';
import { HomeScreen } from '../HomeScreen';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '22 janvier 2026'),
  startOfDay: jest.fn((date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }),
  differenceInDays: jest.fn(() => 30),
  addDays: jest.fn((date) => date),
  subDays: jest.fn((date) => date),
}));

jest.mock('date-fns/locale', () => ({
  fr: {},
}));

jest.mock('../../components/sheets', () => ({
  AddSleepSheet: () => null,
  AddFeedingSheet: () => null,
  AddDiaperSheet: () => null,
  EventActionSheet: () => null,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
    expect(getByText(/Comment va/)).toBeTruthy();
  });

  it('displays quick action tiles', () => {
    const { getAllByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
    expect(getAllByText(/Sommeil/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Biber/).length).toBeGreaterThan(0);
    expect(getAllByText(/Couch/).length).toBeGreaterThan(0);
  });

  it('shows empty activities state when there is no event', () => {
    const { getByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
    expect(getByText(/Aucune activit/i)).toBeTruthy();
  });
});
