import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { categories } from '@/assets/data/home';

const Categories = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: 20,
        paddingVertical: 15,
        paddingRight: 20,
      }}
    >
      {categories.map((category, index) => (
        <View style={styles.categoryCard} key={index}>
          <TouchableOpacity>
            <Image source={category.img} />
            <Text style={styles.categoryText}>{category.text}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    marginEnd: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
  },
  categoryText: {
    padding: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Categories;
