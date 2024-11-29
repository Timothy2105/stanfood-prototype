import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';
import { restaurant } from '@/assets/data/restaurant';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SCROLL_THRESHOLD = 152;
const TEXT_OFFSET = 30;
const ANIMATION_DURATION = 300;

const Details = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const animateHeader = (show) => {
    if (show !== headerVisible) {
      setHeaderVisible(show);
      Animated.timing(headerAnimation, {
        toValue: show ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateText = (show) => {
    if (show !== textVisible) {
      setTextVisible(show);
      Animated.timing(textAnimation, {
        toValue: show ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: () => (
        <Animated.Text style={[styles.headerTitle, { opacity: textAnimation }]}>{restaurant.name}</Animated.Text>
      ),
      headerBackground: () => <Animated.View style={[styles.headerBackground, { opacity: headerAnimation }]} />,
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [headerAnimation, textAnimation]);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
    listener: (event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const isPassedHeaderThreshold = offsetY >= SCROLL_THRESHOLD;
      const isPassedTextThreshold = offsetY >= SCROLL_THRESHOLD + TEXT_OFFSET;

      animateHeader(isPassedHeaderThreshold);

      animateText(isPassedTextThreshold);
    },
  });

  return (
    <ParallaxScrollView
      backgroundColor={'#fff'}
      style={{ flex: 1 }}
      parallaxHeaderHeight={250}
      renderBackground={() => <Image source={restaurant.img} style={styles.backgroundImage} />}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.detailsContainer}>
        <Text>Details</Text>
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerBackground: {
    backgroundColor: '#fff',
    height: '100%',
  },
  headerTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  backgroundImage: {
    height: 300,
    width: '100%',
  },
});

export default Details;
