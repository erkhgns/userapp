import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Animated,
  Easing,
  LogBox,
} from 'react-native';
import LottieView from 'lottie-react-native';

const fruitsAnimation = require('../../assets/bouncing-fruits.json');

const fruits = [
  'Apple',
  'Orange',
  'Watermelon',
  'Avocado',
  'Blueberry',
  'Coconut',
  'Durian',
  'Mango',
];

const refreshingHeight = 100;
const styles = StyleSheet.create({
  flatlist: {},
  row: {
    height: 100,
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'black',
    backgroundColor: 'white',
  },
  rowTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  lottieView: {
    height: refreshingHeight,
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
  },
});

const FruitList = () => {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  const [offsetY, setOffsetY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [extraPaddingTop] = useState(new Animated.Value(0));

  const lottieViewRef = useRef(null);

  useEffect(() => {
    if (isRefreshing) {
      Animated.timing(extraPaddingTop, {
        useNativeDriver: false,
        toValue: refreshingHeight,
        duration: 0,
      }).start();
      lottieViewRef.current.play();
    } else {
      Animated.timing(extraPaddingTop, {
        useNativeDriver: false,
        toValue: 0,
        duration: 400,
        easing: Easing.elastic(1.3),
      }).start();
    }
  }, [isRefreshing]);

  function renderItem({item}) {
    return (
      <View key={item} style={styles.row}>
        <Text style={styles.rowTitle}>{item}</Text>
      </View>
    );
  }

  function onScroll(event) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
  }

  function onRelease() {
    console.log('on scroll');
    console.log(offsetY <= -refreshingHeight && !isRefreshing);
    if (offsetY <= -refreshingHeight && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 3000);
    }
  }

  let progress = 0;
  if (offsetY < 0 && !isRefreshing) {
    progress = offsetY / -refreshingHeight;
  }
  return (
    <View>
      <LottieView
        ref={lottieViewRef}
        style={styles.lottieView}
        source={fruitsAnimation}
        progress={progress}
      />
      <FlatList
        data={fruits}
        renderItem={renderItem}
        style={[styles.flatlist]}
        onScroll={onScroll}
        onResponderRelease={onRelease}
        onResponderTerminate={event => {
          console.log('terminate');
        }}
        ListHeaderComponent={
          <Animated.View
            style={{
              paddingTop: extraPaddingTop,
            }}
          />
        }
      />
    </View>
  );
};

export default FruitList;
