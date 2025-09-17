
import React from 'react';
import { View, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Animated, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

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
  const trackHeight = 4;

  // Calculate position based on value
  const valueToPosition = (val: number) => {
    const percentage = (val - minimumValue) / (maximumValue - minimumValue);
    return percentage * (sliderWidth - thumbSize);
  };

  // Calculate value based on position
  const positionToValue = (pos: number) => {
    const percentage = pos / (sliderWidth - thumbSize);
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    return Math.round(rawValue / step) * step;
  };

  React.useEffect(() => {
    translateX.setValue(valueToPosition(value));
  }, [value]);

  const onGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    const currentPosition = valueToPosition(value);
    const newPosition = Math.max(0, Math.min(sliderWidth - thumbSize, currentPosition + translationX));
    
    translateX.setValue(newPosition);
    
    const newValue = positionToValue(newPosition);
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const finalPosition = valueToPosition(value);
      translateX.setValue(finalPosition);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.track, { width: sliderWidth, height: trackHeight }]}>
        <Animated.View
          style={[
            styles.activeTrack,
            {
              width: Animated.add(translateX, thumbSize / 2),
              height: trackHeight,
            },
          ]}
        />
      </View>
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
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
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  track: {
    backgroundColor: colors.grey,
    borderRadius: 2,
    position: 'absolute',
  },
  activeTrack: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    position: 'absolute',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
});
