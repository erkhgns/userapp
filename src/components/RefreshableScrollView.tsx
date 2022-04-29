import React, {ReactNode, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Platform, SafeAreaView} from 'react-native';
import Indicator from './Indicator';

type RefreshableScrollViewProps = {
  children: ReactNode;
  refreshing: boolean;
  onRefresh(): void;
};
const RefreshableScrollView = ({
  children,
  refreshing,
  onRefresh,
}: RefreshableScrollViewProps) => {
  const [readyToRefresh, setReadyToRefresh] = useState(false);
  const isAndroid = Platform.OS === 'android';
  const MIN_PULLDOWN_DISTANCE = isAndroid ? 0 : -80;
  const handleRelease = e => {
    if (
      (!isAndroid && readyToRefresh) ||
      e.nativeEvent.contentOffset.y <= MIN_PULLDOWN_DISTANCE
    ) {
      onRefresh();
      setReadyToRefresh(false);
    }
  };
  const handleScroll = e => {
    if (e.nativeEvent.contentOffset.y <= MIN_PULLDOWN_DISTANCE) {
      return setReadyToRefresh(true);
    }
  };
  const showIndicator = () => {
    if (isAndroid) {
      return refreshing;
    } else {
      return readyToRefresh || refreshing;
    }
  };
  useEffect(() => {
    setReadyToRefresh(refreshing);
  }, [refreshing]);
  console.log('refreshing', refreshing);
  return (
    <SafeAreaView style={styles.scrollview}>
      {showIndicator() && (
        <Indicator
          style={styles.indicatorStyle}
          isPlaying={readyToRefresh && refreshing}
        />
      )}
      <ScrollView
        style={styles.scrollview}
        onScroll={isAndroid ? undefined : handleScroll}
        onScrollBeginDrag={isAndroid ? handleScroll : undefined}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={handleRelease}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  indicatorStyle: {
    marginVertical: 24,
  },
});

export default RefreshableScrollView;
