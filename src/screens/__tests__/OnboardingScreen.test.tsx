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
  const fillBirthDateAndContinue = (screen: ReturnType<typeof renderWithProviders>) => {
    fireEvent.changeText(screen.getByPlaceholderText('JJ'), '15');
    fireEvent.changeText(screen.getByPlaceholderText('MM'), '06');
    fireEvent.changeText(screen.getByPlaceholderText('AAAA'), '2024');
    fireEvent.press(screen.getByText('Continuer'));
  };

  const fillNameAndContinue = (screen: ReturnType<typeof renderWithProviders>) => {
    fireEvent.changeText(screen.getByPlaceholderText('Ex: Emma'), 'Emma');
    fireEvent.press(screen.getByText('Continuer'));
  };

  const fillHeightAndContinue = (screen: ReturnType<typeof renderWithProviders>) => {
    fireEvent.changeText(screen.getByPlaceholderText('50'), '52');
    fireEvent.press(screen.getByText('Continuer'));
  };

  const fillWeightAndContinue = (screen: ReturnType<typeof renderWithProviders>) => {
    fireEvent.changeText(screen.getByPlaceholderText('3,5'), '3,8');
    fireEvent.press(screen.getByText('Continuer'));
  };

  describe('Step 1 - Date de naissance', () => {
    it('renders step 1 with date inputs', () => {
      const { getByPlaceholderText } = renderWithProviders(<OnboardingScreen />);
      expect(getByPlaceholderText('JJ')).toBeTruthy();
      expect(getByPlaceholderText('MM')).toBeTruthy();
      expect(getByPlaceholderText('AAAA')).toBeTruthy();
    });

    it('shows continue button when date is complete', () => {
      const screen = renderWithProviders(<OnboardingScreen />);

      fireEvent.changeText(screen.getByPlaceholderText('JJ'), '15');
      fireEvent.changeText(screen.getByPlaceholderText('MM'), '06');
      fireEvent.changeText(screen.getByPlaceholderText('AAAA'), '2024');

      expect(screen.getByText('Continuer')).toBeTruthy();
    });
  });

  describe('Step 2 - Nom', () => {
    it('displays name input after completing birth date', () => {
      const screen = renderWithProviders(<OnboardingScreen />);
      fillBirthDateAndContinue(screen);

      expect(screen.getByPlaceholderText('Ex: Emma')).toBeTruthy();
    });
  });

  describe('Step 3 - Taille', () => {
    it('displays height input with correct placeholder', () => {
      const screen = renderWithProviders(<OnboardingScreen />);
      fillBirthDateAndContinue(screen);
      fillNameAndContinue(screen);

      expect(screen.getByPlaceholderText('50')).toBeTruthy();
    });
  });

  describe('Step 4 - Poids', () => {
    it('displays weight input with comma decimal separator', () => {
      const screen = renderWithProviders(<OnboardingScreen />);
      fillBirthDateAndContinue(screen);
      fillNameAndContinue(screen);
      fillHeightAndContinue(screen);

      expect(screen.getByPlaceholderText('3,5')).toBeTruthy();
    });
  });

  describe('Step 5 - Sexe', () => {
    it('displays gender selection buttons', () => {
      const screen = renderWithProviders(<OnboardingScreen />);
      fillBirthDateAndContinue(screen);
      fillNameAndContinue(screen);
      fillHeightAndContinue(screen);
      fillWeightAndContinue(screen);

      expect(screen.getByText(/Fille/i)).toBeTruthy();
      expect(screen.getByText(/Gar/)).toBeTruthy();
    });
  });

  describe('Step 6 - Relation', () => {
    it('displays relationship selection options', () => {
      const screen = renderWithProviders(<OnboardingScreen />);
      fillBirthDateAndContinue(screen);
      fillNameAndContinue(screen);
      fillHeightAndContinue(screen);
      fillWeightAndContinue(screen);
      fireEvent.press(screen.getByText(/Fille/i));
      fireEvent.press(screen.getByText('Continuer'));

      expect(screen.getByText(/Maman/i)).toBeTruthy();
      expect(screen.getByText(/Papa/i)).toBeTruthy();
      expect(screen.getByText(/Autre parent/)).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('shows back and continue buttons on step 1', () => {
      const screen = renderWithProviders(<OnboardingScreen />);

      expect(screen.getByText('Retour')).toBeTruthy();
      expect(screen.getByText('Continuer')).toBeTruthy();
    });
  });
});
