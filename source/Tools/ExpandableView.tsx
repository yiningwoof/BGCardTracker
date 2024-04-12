import React, {useEffect, useState} from 'react';
import {StyleSheet, Animated} from 'react-native';

export default function ExpandableView({
  expanded = false,
  isCardExpandable = false,
  children,
}) {
  const [height] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    scrollView: {
      height: height,
      backgroundColor: '#F9F0EA',
    },
    scrollViewNoBackground: {
      height: height,
      backgroundColor: 'white',
    },
  });

  useEffect(() => {
    Animated.timing(height, {
      toValue: expanded ? 600 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);

  // console.log('rerendered');

  return (
    <Animated.ScrollView
      style={
        isCardExpandable ? styles.scrollView : styles.scrollViewNoBackground
      }>
      {children}
    </Animated.ScrollView>
  );
}
