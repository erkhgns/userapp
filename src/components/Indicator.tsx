import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
const COUNT = 4;
const DURATION = 1700;
const SIZE = 8;
const renderComponent = ({
  index,
  progress,
  isPlaying,
}: {
  index: number;
  progress: Animated.Value;
  isPlaying: boolean;
}) => {
  const interpolation = progress.interpolate({
    inputRange: [
      200 * index,
      0.4 * DURATION + 200 * index,
      Math.min(0.8 * DURATION + 200 * index, DURATION),
    ],
    outputRange: [0.0, 1.0, 0.0],
  });
  return (
    <Animated.View
      style={{
        width: SIZE,
        height: SIZE,
        margin: SIZE / 2,
        borderRadius: SIZE / 2,
        backgroundColor: 'blue',
        opacity: isPlaying ? interpolation : 1,
        transform: isPlaying
          ? [
              {
                scale: interpolation,
              },
            ]
          : [],
      }}
      key={String(index)}
    />
  );
};
interface Props {
  style: StyleProp<ViewStyle>;
  isPlaying?: boolean;
}
const DotIndicator = ({style, isPlaying = true}: Props) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animation = Animated.timing(progress, {
    duration: DURATION,
    easing: Easing.linear,
    useNativeDriver: true,
    toValue: DURATION,
  });
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(animation).start();
    } else {
      Animated.loop(animation).stop();
    }
  }, [animation, isPlaying]);
  return (
    <View style={[styles.container, style]}>
      {new Array(COUNT)
        .fill(null)
        .map((_, index) => renderComponent({index, progress, isPlaying}))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default DotIndicator;
