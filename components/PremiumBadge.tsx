
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, spacing } from '../styles/commonStyles';

interface PremiumBadgeProps {
  isPremium: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function PremiumBadge({ isPremium, size = 'medium' }: PremiumBadgeProps) {
  if (!isPremium) return null;

  const sizeStyles = {
    small: { padding: 2, borderRadius: 6 },
    medium: { padding: 4, borderRadius: 8 },
    large: { padding: 6, borderRadius: 10 },
  };

  const iconSizes = {
    small: 10,
    medium: 12,
    large: 16,
  };

  const textSizes = {
    small: 8,
    medium: 10,
    large: 12,
  };

  return (
    <View style={[styles.badge, sizeStyles[size]]}>
      <Icon name="star" size={iconSizes[size]} color={colors.background} />
      <Text style={[styles.text, { fontSize: textSizes[size] }]}>
        Premium
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  text: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 2,
  },
});
