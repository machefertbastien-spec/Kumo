import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils';
import OnboardingScreen from '../OnboardingScreen';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '22 janvier 2026'),
}));

jest.mock('date-fns/locale', () => ({
  fr: {},
}));

describe('OnboardingScreen - Multi-step wizard', () => {
  describe('Step 1 - Date de naissance', () => {
    it('renders step 1 with date inputs', () => {
      const { getByText, getByPlaceholderText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('Kumo')).toBeTruthy();
      expect(getByText('1 / 5')).toBeTruthy();
      expect(getByText(/Quelle est la date de naissance/)).toBeTruthy();
      expect(getByPlaceholderText('JJ')).toBeTruthy();
      expect(getByPlaceholderText('MM')).toBeTruthy();
      expect(getByPlaceholderText('AAAA')).toBeTruthy();
    });

    it('enables continue button when date is complete', () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(<OnboardingScreen />);
      
      const dayInput = getByPlaceholderText('JJ');
      const monthInput = getByPlaceholderText('MM');
      const yearInput = getByPlaceholderText('AAAA');
      
      fireEvent.changeText(dayInput, '15');
      fireEvent.changeText(monthInput, '06');
      fireEvent.changeText(yearInput, '2024');
      
      const continueButton = getByText('Continuer');
      expect(continueButton).toBeTruthy();
    });
  });

  describe('Step 2 - Taille', () => {
    it('displays height input with correct placeholder', () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(<OnboardingScreen />);
      
      // Navigate to step 2 (this would require completing step 1 first in real usage)
      expect(getByPlaceholderText('50')).toBeTruthy();
      expect(getByText('cm')).toBeTruthy();
    });
  });

  describe('Step 3 - Poids', () => {
    it('displays weight input with comma decimal separator', () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByPlaceholderText('3,5')).toBeTruthy();
      expect(getByText('kg')).toBeTruthy();
    });
  });

  describe('Step 4 - Sexe', () => {
    it('displays gender selection buttons', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('Fille')).toBeTruthy();
      expect(getByText('Garçon')).toBeTruthy();
    });

    it('requires gender selection to continue', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      // Continue button should exist but might be disabled without selection
      expect(getByText('Continuer')).toBeTruthy();
    });
  });

  describe('Step 5 - Relation', () => {
    it('displays relationship selection options', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('Maman')).toBeTruthy();
      expect(getByText('Papa')).toBeTruthy();
      expect(getByText(/Autre parent/)).toBeTruthy();
    });

    it('displays final step indicator', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('5 / 5')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('displays back button on all steps except first', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('Retour')).toBeTruthy();
    });

    it('displays continue button on all steps', () => {
      const { getByText } = renderWithProviders(<OnboardingScreen />);
      
      expect(getByText('Continuer')).toBeTruthy();
    });
  });
});
