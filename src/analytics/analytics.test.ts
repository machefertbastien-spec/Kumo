import { buildSafeEventProperties } from './index';

describe('Kumo analytics privacy contract', () => {
  it('exposes only the approved common properties', () => {
    expect(Object.keys(buildSafeEventProperties()).sort()).toEqual(
      [
        '$process_person_profile',
        'analytics_schema_version',
        'app_environment',
        'app_id',
        'app_platform',
        'app_version',
        'platform',
      ].sort(),
    );
  });

  it('never exposes baby or care data', () => {
    const properties = buildSafeEventProperties();

    for (const forbidden of [
      'babyId',
      'caregiverId',
      'event_type',
      'amountMl',
      'diaperType',
      'startTs',
      'endTs',
      'note',
      'weight',
      'height',
    ]) {
      expect(properties).not.toHaveProperty(forbidden);
    }
  });
});
