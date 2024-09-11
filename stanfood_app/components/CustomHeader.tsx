import React, { useCallback, useRef, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import LogoIcon from '@/assets/images/stanfoodicon';
import Colors from '@/constants/Colors';
import BottomSheet, { BottomSheetRef } from './BottomSheet';

const SearchBar = () => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.medium} />
        <TextInput style={styles.input} placeholder="Dining halls, dishes, ingredients" />
      </View>
      <Link href={'/(modal)/filter_hub'} asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  </View>
);

const CustomHeader = () => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [hungerState, setHungerState] = useState<'hungry' | 'full'>('hungry');
  const [status, setStatus] = useState('Online');

  const openModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleToggle = useCallback((toggle: 'hungry' | 'full') => {
    setHungerState(toggle);
  }, []);

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
  }, []);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => {
    setIsPressed(false);
    openModal();
  };

  const displayStatus = (status: string) => {
    return status === 'Appear Offline' ? 'Offline' : status;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheet
        ref={bottomSheetRef}
        onToggle={handleToggle}
        onStatusChange={handleStatusChange}
        initialStatus={status}
      />
      <View style={styles.outerContainer}>
        <Pressable
          style={[styles.logoAndTitleContainer, isPressed && styles.logoAndTitleContainerPressed]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.logoAndTextWrapper}>
            <LogoIcon />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {displayStatus(status)} · {hungerState === 'hungry' ? 'Hungry' : 'Full'}
              </Text>
              <View style={styles.locationName}>
                <Text style={styles.subtitle}>Selected Location</Text>
                <Ionicons name="chevron-down" size={20} color={Colors.primary} />
              </View>
            </View>
          </View>
        </Pressable>
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
  outerContainer: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logoAndTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 10,
    paddingVertical: 2,
  },
  logoAndTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    gap: 20,
  },
  logoAndTitleContainerPressed: {
    backgroundColor: Colors.grey,
  },
  titleContainer: {
    marginLeft: -5,
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
    marginRight: 5,
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
