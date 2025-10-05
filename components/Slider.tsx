
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors, spacing, borderRadius, shadows } from '../styles/commonStyles';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export default function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
}: SliderProps) {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const sliderWidth = 280;
  const thumbSize = 24;

  const valueToPosition = (val: number): number => {
    const percentage = (val - minimumValue) / (maximumValue - minimumValue);
    return percentage * (sliderWidth - thumbSize);
  };

  const positionToValue = (pos: number): number => {
    const percentage = pos / (sliderWidth - thumbSize);
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    return Math.round(rawValue / step) * step;
  };

  React.useEffect(() => {
    const position = valueToPosition(value);
    translateX.setValue(position);
  }, [value]);

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      console.log('Slider gesture began');
    } else if (event.nativeEvent.state === State.ACTIVE) {
      const newPosition = Math.max(0, Math.min(sliderWidth - thumbSize, event.nativeEvent.translationX + valueToPosition(value)));
      const newValue = positionToValue(newPosition);
      
      if (newValue !== value) {
        onValueChange(newValue);
      }
    } else if (event.nativeEvent.state === State.END) {
      console.log('Slider gesture ended with value:', value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.track, { width: sliderWidth }]}>
        <Animated.View
          style={[
            styles.activeTrack,
            {
              width: translateX.interpolate({
                inputRange: [0, sliderWidth - thumbSize],
                outputRange: [thumbSize / 2, sliderWidth - thumbSize / 2],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  activeTrack: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: -10,
    ...shadows.md,
    borderWidth: 2,
    borderColor: colors.background,
  },
});
