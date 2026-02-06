import React from 'react';
import { View } from 'react-native';

interface MiniBarsProps {
  values: number[];
  accentColor: string;
}

export function MiniBars({ values, accentColor }: MiniBarsProps) {
  const max = Math.max(1e-6, ...values);
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, paddingHorizontal: 14, paddingBottom: 12 }}>
      {values.map((v, idx) => {
        const h = Math.round((v / max) * 46);
        return (
          <View key={idx} style={{ width: 18, alignItems: "center" }}>
            <View
              style={{
                width: 18,
                height: Math.max(3, h),
                borderRadius: 8,
                backgroundColor: idx === values.length - 1 ? accentColor : "#EFE7E1",
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
