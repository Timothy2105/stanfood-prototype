import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '@/assets/images/stanfoodicon.svg';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import BottomSheet from './BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const SearchBar = () => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.medium} />
        <TextInput style={styles.input} placeholder="Dining halls, dishes, ingredients" />
      </View>
      <Link href={'/'} asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  </View>
);

const CustomHeader = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openModal = () => {
    bottomSheetRef.current?.present();
  };

  const [hungerState, setHungerState] = useState<'hungry' | 'full'>('hungry');
  const handleToggle = (toggle: 'hungry' | 'full') => {
    setHungerState(toggle);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheet ref={bottomSheetRef} onToggle={handleToggle} />

      <View style={styles.container}>
        <TouchableOpacity onPress={openModal}>
          <LogoIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.titleContainer} onPress={openModal}>
          <Text style={styles.title}>Online · {hungerState === 'hungry' ? 'Hungry' : 'Full'}</Text>
          <View style={styles.locationName}>
            <Text style={styles.subtitle}>Selected Location</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <SearchBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.medium,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    height: 60,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});

export default CustomHeader;
