import React from 'react';
import { View } from 'react-native';

const THEME = {
  line: "#EFE7E1",
};

export function Divider() {
  return <View style={{ height: 1, backgroundColor: THEME.line }} />;
}
