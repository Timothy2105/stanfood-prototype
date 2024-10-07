import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, FlatList, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import categories from '@/assets/data/allergens_filter.json';

interface Category {
  name: string;
  count: number;
  checked: boolean;
}

const STORAGE_KEY = '@allergens_filter_state';

const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
    .replace(/[-\s"']/g, '');
};

const SearchBar = React.memo(({ value, onChangeText }: { value: string; onChangeText: (text: string) => void }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <Ionicons style={styles.searchIcon} name="search" size={20} color={Colors.medium} />
        <TextInput
          style={styles.input}
          placeholder="Looking for a specific allergen?"
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
));

const CategoryItem = React.memo(
  ({ item, onToggle }: { item: Category; onToggle: (name: string) => void }) => (
    <Pressable
      style={({ pressed }) => [
        styles.itemRow,
        {
          backgroundColor: pressed ? Colors.mediumLightGrey : '#fff',
        },
      ]}
      onPress={() => onToggle(item.name)}
    >
      <Text style={styles.itemText}>
        {item.name} <Text style={styles.itemTextDetail}>({item.count})</Text>
      </Text>
      <View>
        <BouncyCheckbox
          isChecked={item.checked}
          fillColor={Colors.primary}
          unFillColor="#fff"
          useNativeDriver={true}
          iconStyle={{ borderColor: Colors.primary, borderRadius: 4, borderWidth: 2 }}
          innerIconStyle={{ borderColor: Colors.primary, borderRadius: 4 }}
          onPress={() => onToggle(item.name)}
        />
      </View>
    </Pressable>
  ),
  (prevProps, nextProps) => prevProps.item.checked === nextProps.item.checked
);

const AllergensFilter = () => {
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

  const filteredItems = useMemo(
    () => items.filter((item) => normalizeString(item.name).includes(normalizeString(searchQuery))),
    [items, searchQuery]
  );

  const selectedItems = useMemo(() => items.filter((item) => item.checked), [items]);

  useEffect(() => {
    const hasSelected = selectedItems.length > 0;
    const animationConfig = { duration: 150 };
    flexWidth.value = withTiming(hasSelected ? 150 : 0, animationConfig);
    scale.value = withTiming(hasSelected ? 1 : 0, animationConfig);
    gap.value = withTiming(hasSelected ? 12 : 0, animationConfig);
  }, [selectedItems, flexWidth, scale, gap]);

  const handleClearAll = useCallback(() => {
    setItems((prevItems) => prevItems.map((item) => ({ ...item, checked: false })));
  }, []);

  const toggleItemCheck = useCallback((itemName: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.name === itemName ? { ...item, checked: !item.checked } : item))
    );
  }, []);

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

  const renderItem: ListRenderItem<Category> = useCallback(
    ({ item }) => <CategoryItem item={item} onToggle={toggleItemCheck} />,
    [toggleItemCheck]
  );

  return (
    <>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.container}>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={21}
          removeClippedSubviews={true}
        />
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
                saveItems(items);
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

export default AllergensFilter;
