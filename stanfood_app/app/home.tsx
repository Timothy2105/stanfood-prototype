import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Categories from '@/components/Categories';
import Restaurants from '@/components/Restaurants';
import Offers from '@/components/Offers';
import DiningHallReviews from '@/components/DiningHallReviews';
import Colors from '@/constants/Colors';

const Page = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Categories />
        <Text style={styles.header}>Top Picks Near Campus</Text>
        <Restaurants />
        <Text style={styles.header}>Free Food!</Text>
        <Offers />
        <Text style={styles.header}>Dining Hall Reviews</Text>
        <DiningHallReviews />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 50,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
});

export default Page;
