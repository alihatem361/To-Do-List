import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

// Small square checkbox + label, matching the "Show Password" control in the
// design. Pressing anywhere on the row toggles it.
const Checkbox = ({ label, value, onValueChange, style }) => (
  <TouchableOpacity
    style={[styles.row, style]}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.7}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: value }}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={[styles.box, value && styles.boxChecked]}>
      {value && <Text style={styles.check}>✓</Text>}
    </View>
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  check: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
});

export default Checkbox;
