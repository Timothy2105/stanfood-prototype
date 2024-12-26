import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDishById } from '@/assets/data/restaurant';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const Dish = () => {
  const { id } = useLocalSearchParams();
  const item = getDishById(+id);
  const router = useRouter();

  //   const addToCart = () => {
  //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //     router.back();
  //   };

  const addToFavorites = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <View style={styles.container}>
        <Animated.Image entering={FadeIn.duration(450).delay(200)} source={item?.img} style={styles.image} />
        <View style={{ padding: 20 }}>
          <Animated.Text entering={FadeInLeft.duration(400).delay(300)} style={styles.dishName}>
            {item?.name}
          </Animated.Text>
          <Animated.Text entering={FadeInLeft.duration(400).delay(500)} style={styles.dishInfo}>
            {item?.info}
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.fullButton} onPress={addToFavorites}>
            {/* <Text style={styles.footerText}>Add for ${item?.price}</Text> */}
            <Text style={styles.footerText}>Add to Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dishInfo: {
    fontSize: 16,
    color: Colors.dark,
  },
  footer: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dish;
