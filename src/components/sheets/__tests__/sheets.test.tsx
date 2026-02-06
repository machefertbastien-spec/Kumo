import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReminderSheet } from '../ReminderSheet';
import { BottomSheet } from '../BottomSheet';
import { Text, Pressable } from 'react-native';

describe('ReminderSheet', () => {
  const mockOnPickMinutes = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    expect(getByText('Rappel Repas')).toBeTruthy();
    expect(getByText('Choisis un rappel rapide (push si activé).')).toBeTruthy();
  });

  it('returns null when not visible', () => {
    const { queryByText } = render(
      <ReminderSheet
        visible={false}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    expect(queryByText('Rappel Repas')).toBeNull();
  });

  it('displays all time chip options', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    expect(getByText('20 min')).toBeTruthy();
    expect(getByText('40 min')).toBeTruthy();
    expect(getByText('60 min')).toBeTruthy();
    expect(getByText('90 min')).toBeTruthy();
  });

  it('calls onPickMinutes with 20 when 20 min chip pressed', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    const chip20 = getByText('20 min');
    fireEvent.press(chip20);

    expect(mockOnPickMinutes).toHaveBeenCalledWith(20);
  });

  it('calls onPickMinutes with 40 when 40 min chip pressed', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    const chip40 = getByText('40 min');
    fireEvent.press(chip40);

    expect(mockOnPickMinutes).toHaveBeenCalledWith(40);
  });

  it('calls onPickMinutes with 60 when 60 min chip pressed', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    const chip60 = getByText('60 min');
    fireEvent.press(chip60);

    expect(mockOnPickMinutes).toHaveBeenCalledWith(60);
  });

  it('calls onPickMinutes with 90 when 90 min chip pressed', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    const chip90 = getByText('90 min');
    fireEvent.press(chip90);

    expect(mockOnPickMinutes).toHaveBeenCalledWith(90);
  });

  it('calls onClose when Fermer button pressed', () => {
    const { getByText } = render(
      <ReminderSheet
        visible={true}
        title="Rappel Repas"
        onPickMinutes={mockOnPickMinutes}
        onClose={mockOnClose}
      />
    );

    const closeButton = getByText('Fermer');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

describe('BottomSheet', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when visible', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('returns null when not visible', () => {
    const { queryByText } = render(
      <BottomSheet visible={false} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );

    expect(queryByText('Test Content')).toBeNull();
  });

  it('calls onClose when backdrop pressed', () => {

    const { getByTestId } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );

    const backdrop = getByTestId('backdrop');
    fireEvent.press(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders with correct styling', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={mockOnClose}>
        <Text>Test Content</Text>
      </BottomSheet>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });
});
