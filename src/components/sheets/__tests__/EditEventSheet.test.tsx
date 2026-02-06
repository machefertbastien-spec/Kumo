import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EditEventSheet } from '../EditEventSheet';
import { Alert } from 'react-native';

jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'HH:mm') return '10:30';
    return '22 janvier 2026 • 10:30';
  }),
}));

jest.mock('date-fns/locale', () => ({
  fr: {},
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('EditEventSheet', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnStopSleepNow = jest.fn();
  const nowMs = Date.now();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Feeding Event', () => {
    const feedingEvent = {
      id: '1',
      type: 'feeding' as const,
      ts: nowMs,
      amountMl: 120,
    };

    it('renders feeding event editor', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      expect(getByText('Modifier • Repas')).toBeTruthy();
      expect(getByText('Quantité')).toBeTruthy();
    });

    it('increases amount when plus button pressed', () => {
      const { getAllByText, getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const plusButtons = getAllByText('+');
      // First plus button is for amount
      fireEvent.press(plusButtons[0]);

      // After pressing, the save should work with increased amount
      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMl: 130, // 120 + 10
        })
      );
    });

    it('decreases amount when minus button pressed', () => {
      const { getAllByText, getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const minusButtons = getAllByText('−');
      fireEvent.press(minusButtons[0]);

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMl: 110, // 120 - 10
        })
      );
    });

    it('saves feeding event with updated amount', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes sheet when cancel button pressed', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const cancelButton = getByText('Annuler');
      fireEvent.press(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('shows delete confirmation alert', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={feedingEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const deleteButton = getByText('Supprimer');
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Supprimer ?',
        'Cet événement sera supprimé.',
        expect.any(Array)
      );
    });
  });

  describe('Diaper Event', () => {
    const diaperEvent = {
      id: '2',
      type: 'diaper' as const,
      ts: nowMs,
      diaperType: 'pee' as const,
    };

    it('renders diaper event editor', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={diaperEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      expect(getByText('Modifier • Couche')).toBeTruthy();
      expect(getByText('Type')).toBeTruthy();
    });

    it('changes diaper type when chip pressed', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={diaperEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const cacaChip = getByText('Caca');
      fireEvent.press(cacaChip);

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          diaperType: 'poo',
        })
      );
    });

    it('saves diaper event with updated type', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={diaperEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const mixteChip = getByText('Mixte');
      fireEvent.press(mixteChip);

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          diaperType: 'mixed',
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Sleep Event', () => {
    const sleepEvent = {
      id: '3',
      type: 'sleep' as const,
      ts: nowMs - 3600000, // 1 hour ago
      startTs: nowMs - 3600000,
      endTs: nowMs,
    };

    it('renders sleep event editor', () => {
      const { getByText } = render(
        <EditEventSheet
          visible={true}
          event={sleepEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      expect(getByText('Modifier • Dodo')).toBeTruthy();
      expect(getByText('Début')).toBeTruthy();
      expect(getByText('Fin')).toBeTruthy();
    });

    it('adjusts start time with stepper', () => {
      const { getAllByText, getByText } = render(
        <EditEventSheet
          visible={true}
          event={sleepEvent}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      const plusButtons = getAllByText('+');
      // First plus button should be for start time
      fireEvent.press(plusButtons[0]);

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      expect(mockOnSave).toHaveBeenCalled();
    });

    describe('Sleep in progress', () => {
      const ongoingSleepEvent = {
        id: '4',
        type: 'sleep' as const,
        ts: nowMs - 3600000,
        startTs: nowMs - 3600000,
        endTs: null,
      };

      it('shows stop sleep now button for ongoing sleep', () => {
        const { getByText } = render(
          <EditEventSheet
            visible={true}
            event={ongoingSleepEvent}
            nowMs={nowMs}
            onClose={mockOnClose}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            onStopSleepNow={mockOnStopSleepNow}
          />
        );

        expect(getByText('Terminer maintenant')).toBeTruthy();
      });

      it('calls onStopSleepNow when button pressed', () => {
        const { getByText } = render(
          <EditEventSheet
            visible={true}
            event={ongoingSleepEvent}
            nowMs={nowMs}
            onClose={mockOnClose}
            onSave={mockOnSave}
            onDelete={mockOnDelete}
            onStopSleepNow={mockOnStopSleepNow}
          />
        );

        const stopButton = getByText('Terminer maintenant');
        fireEvent.press(stopButton);

        expect(mockOnStopSleepNow).toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('returns null when not visible', () => {
      const { queryByText } = render(
        <EditEventSheet
          visible={false}
          event={null}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      expect(queryByText('Modifier •')).toBeNull();
    });

    it('handles null event gracefully', () => {
      const { queryByText } = render(
        <EditEventSheet
          visible={true}
          event={null}
          nowMs={nowMs}
          onClose={mockOnClose}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onStopSleepNow={mockOnStopSleepNow}
        />
      );

      // Should render but with default values
      expect(queryByText('Enregistrer')).toBeTruthy();
    });
  });
});
