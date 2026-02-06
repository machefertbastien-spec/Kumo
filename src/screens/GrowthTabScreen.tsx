import React, { useState } from 'react';
import { GrowthChartsScreen, AddMeasurementSheet } from '../features/growth';
import { useBaby } from '../contexts';

export function GrowthTabScreen() {
  const { baby } = useBaby();
  const [addSheetVisible, setAddSheetVisible] = useState(false);

  const handleAddMeasurement = () => setAddSheetVisible(true);
  const handleSheetClose = () => setAddSheetVisible(false);
  const handleSheetSuccess = () => {
    setAddSheetVisible(false);
  };

  if (!baby) return null;

  return (
    <>
      <GrowthChartsScreen
        childId={baby.id}
        childDob={baby.birthDateISO}
        childSex={baby.sex}
        onAddMeasurement={handleAddMeasurement}
      />
      <AddMeasurementSheet
        childId={baby.id}
        visible={addSheetVisible}
        onClose={handleSheetClose}
        onSuccess={handleSheetSuccess}
      />
    </>
  );
}
