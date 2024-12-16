import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, SectionList, ListRenderItem } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';
import { restaurant } from '@/assets/data/restaurant';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SCROLL_THRESHOLD = 152;
const TEXT_OFFSET = 30;
const ANIMATION_DURATION = 300;

const Details = () => {
  const navigation = useNavigation();

  const DATA = restaurant.food.map((item, index) => ({
    title: item.category,
    data: item.meals,
    index,
  }));

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

  const renderItem: ListRenderItem<any> = ({ item }) => (
    <Link href={'/'} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dish}>{item.name}</Text>
          <Text style={styles.dishText}>{item.info}</Text>
          <Text style={styles.dishText}>${item.price}</Text>
        </View>
        <Image source={item.img} style={styles.dishImage} />
      </TouchableOpacity>
    </Link>
  );

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
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantDescription}>
          {restaurant.delivery} ·{' '}
          {restaurant.tags.map((tag, index) => `${tag}${index < restaurant.tags.length - 1 ? ' · ' : ''}`)}
        </Text>
        <Text style={styles.restaurantDescription}>{restaurant.about}</Text>
        <SectionList
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(item, index) => `${item.id + index}`}
          scrollEnabled={false}
          sections={DATA}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.grey }} />}
          SectionSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.grey }} />}
          renderSectionHeader={({ section: { title, index } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        />
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
  restaurantName: {
    fontSize: 30,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  restaurantDescription: {
    fontSize: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    lineHeight: 22,
    color: Colors.mediumDark,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
  },
  dishImage: {
    height: 95,
    width: 90,
    borderRadius: 4,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
  },
  dish: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  dishText: {
    fontSize: 14,
    color: Colors.mediumDark,
    marginRight: 25,
    paddingVertical: 4,
  },
});

export default Details;
