import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils';
import { HomeScreen } from '../HomeScreen';

// Mock the date-fns functions
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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
    // Just check that it renders - Context providers will supply default data
    expect(getByText).toBeTruthy();
  });

  it('displays quick action tiles', () => {
    const { getAllByText } = renderWithProviders(<HomeScreen nowMs={Date.now()} />);
    expect(getAllByText('Dodo').length).toBeGreaterThan(0);
    expect(getAllByText('Repas').length).toBeGreaterThan(0);
    expect(getAllByText('Couche').length).toBeGreaterThan(0);
  });
});
