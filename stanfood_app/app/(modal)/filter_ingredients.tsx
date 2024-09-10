import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { Link, useNavigation } from 'expo-router';
import categories from '@/assets/data/ingredients_filter.json';
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Category {
  name: string;
  count: number;
  checked: boolean;
}

const STORAGE_KEY = '@ingredients_filter_state';

const normalizeString = (str: string) => {
  return (
    str
      .toLowerCase()
      // Replace quotes with straight quotes for matching
      .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
      // Remove quotes, spaces, and dashes
      .replace(/[-\s"']/g, '')
  );
};

const SearchBar = ({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.medium} />
        <TextInput
          style={styles.input}
          placeholder="Looking for a specific ingredient?"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.searchClearButton}>
            <Ionicons name="close-outline" size={20} color={Colors.medium} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

// const ItemBox = () => <Text style={styles.header}>Categories</Text>;

const IngredientsFilter = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const gap = useSharedValue(0);

  const loadItems = useCallback(async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setItems(
          categories.map((item) => ({
            ...item,
            checked: parsedState[item.name] || false,
          }))
        );
      } else {
        setItems(categories.map((item) => ({ ...item, checked: false })));
      }
    } catch (error) {
      console.error('Error loading state:', error);
      setItems(categories.map((item) => ({ ...item, checked: false })));
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const saveItems = useCallback(async (newItems: Category[]) => {
    try {
      const state = newItems.reduce((acc, item) => {
        acc[item.name] = item.checked;
        return acc;
      }, {} as Record<string, boolean>);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, []);

  const filteredItems = items.filter((item) => normalizeString(item.name).includes(normalizeString(searchQuery)));

  const selectedItems = items.filter((item) => item.checked);

  useEffect(() => {
    const hasSelected = selectedItems.length > 0;
    const animationConfig = { duration: 150 };
    flexWidth.value = withTiming(hasSelected ? 150 : 0, animationConfig);
    scale.value = withTiming(hasSelected ? 1 : 0, animationConfig);
    gap.value = withTiming(hasSelected ? 12 : 0, animationConfig);
  }, [selectedItems]);

  const handleClearAll = useCallback(() => {
    const newItems = items.map((item) => ({ ...item, checked: false }));
    setItems(newItems);
    saveItems(newItems);
  }, [items, saveItems]);

  const toggleItemCheck = useCallback(
    (itemName: string) => {
      const newItems = items.map((item) => (item.name === itemName ? { ...item, checked: !item.checked } : item));
      setItems(newItems);
      saveItems(newItems);
    },
    [items, saveItems]
  );

  const animatedButton = useAnimatedStyle(() => ({
    width: flexWidth.value,
    opacity: scale.value,
    display: scale.value === 0 ? 'none' : 'flex',
  }));

  const animatedButtonContainerStyle = useAnimatedStyle(() => ({
    flexDirection: 'row' as const,
    gap: gap.value,
    justifyContent: 'center' as const,
  }));

  const animatedText = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderItem: ListRenderItem<Category> = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.itemRow,
        {
          backgroundColor: pressed ? Colors.mediumLightGrey : '#fff',
        },
      ]}
      onPress={() => toggleItemCheck(item.name)}
    >
      <Text style={styles.itemText}>
        {item.name} <Text style={styles.itemTextDetail}>({item.count})</Text>
      </Text>
      <View>
        <BouncyCheckbox
          isChecked={item.checked}
          fillColor={Colors.primary}
          unFillColor="#fff"
          useBuiltInState={false}
          iconStyle={{ borderColor: Colors.primary, borderRadius: 4, borderWidth: 2 }}
          innerIconStyle={{ borderColor: Colors.primary, borderRadius: 4 }}
          onPress={() => toggleItemCheck(item.name)}
        />
      </View>
    </Pressable>
  );

  return (
    <>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.container}>
        <FlatList data={filteredItems} renderItem={renderItem} keyExtractor={(item) => item.name} />
        <View style={{ height: 76 }} />
        <View style={styles.footer}>
          <Animated.View style={animatedButtonContainerStyle}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.View style={[animatedButton, styles.outlineButton]}>
                <Animated.Text style={[animatedText, styles.outlinedButtonText]}>Clear All</Animated.Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fullButton}
              onPress={() => {
                saveItems(items); // Save state before navigating back
                navigation.goBack();
              }}
            >
              <Text style={styles.footerText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.ultraLightGrey,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -5,
    },
  },
  fullButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    height: 56,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // itemContainer: {
  //   backgroundColor: '#fff',
  //   padding: 8,
  //   borderRadius: 8,
  //   marginBottom: 16,
  // },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 5,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica',
  },
  itemTextDetail: {
    fontWeight: '400',
    color: Colors.medium,
  },
  searchContainer: {
    paddingTop: 10,
    height: 60,
    backgroundColor: Colors.ultraLightGrey,
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
    backgroundColor: Colors.grey,
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
  searchClearButton: {
    paddingRight: 10,
  },
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 56,
  },
  outlinedButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default IngredientsFilter;
