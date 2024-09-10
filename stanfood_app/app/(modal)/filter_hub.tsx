import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  LinearTransition,
  interpolate,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

interface Category {
  name: string;
  count: number;
  checked: boolean;
  type: string;
}

interface Section {
  title: string;
  data: Category[];
}

const STORAGE_KEYS = {
  dishes: '@dishes_filter_state',
  ingredients: '@ingredients_filter_state',
  allergens: '@allergens_filter_state',
  locations: '@locations_filter_state',
  mealTimes: '@meal_times_filter_state',
};

const SECTION_TITLES = {
  dishes: 'Selected Dishes',
  ingredients: 'Selected Ingredients',
  allergens: 'Selected Allergens',
  locations: 'Selected Locations',
  mealTimes: 'Selected Meal Times',
};

const ItemBox = () => (
  <View style={styles.itemContainer}>
    <Link href="/filter_dishes" asChild>
      <TouchableOpacity style={styles.firstSubFilter}>
        <Ionicons name="restaurant-outline" size={22} color={Colors.primary} />
        <Text style={styles.subFilterText}>Dishes</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity>
    </Link>

    <Link href="/filter_ingredients" asChild>
      <TouchableOpacity style={styles.middleSubFilter}>
        <Ionicons name="nutrition-outline" size={22} color={Colors.primary} />
        <Text style={styles.subFilterText}>Ingredients</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity>
    </Link>

    <Link href="/filter_allergens" asChild>
      <TouchableOpacity style={styles.middleSubFilter}>
        <Ionicons name="leaf-outline" size={22} color={Colors.primary} />
        <Text style={styles.subFilterText}>Allergens</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity>
    </Link>

    <Link href="/filter_meal_times" asChild>
      <TouchableOpacity style={styles.middleSubFilter}>
        <Ionicons name="alarm-outline" size={22} color={Colors.primary} />
        <Text style={styles.subFilterText}>Meal Time</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity>
    </Link>

    <Link href="/filter_locations" asChild>
      <TouchableOpacity style={styles.lastSubFilter}>
        <Ionicons name="compass-outline" size={22} color={Colors.primary} />
        <Text style={styles.subFilterText}>Location</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity>
    </Link>
  </View>
);

const Filter = () => {
  const navigation = useNavigation();
  const [sections, setSections] = useState<Section[]>([]);
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const gap = useSharedValue(0);

  const loadActiveSections = useCallback(async () => {
    try {
      const sectionsPromises = Object.entries(STORAGE_KEYS).map(async ([key, storageKey]) => {
        const savedState = await AsyncStorage.getItem(storageKey);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          const activeFilters = Object.entries(parsedState)
            .filter(([_, isChecked]) => isChecked)
            .map(([name, _]) => ({ name, count: 0, checked: true, type: key }));
          if (activeFilters.length > 0) {
            return { title: SECTION_TITLES[key as keyof typeof SECTION_TITLES], data: activeFilters };
          }
        }
        return null;
      });

      const resolvedSections = (await Promise.all(sectionsPromises)).filter(
        (section): section is Section => section !== null
      );
      setSections(resolvedSections);
    } catch (error) {
      console.error('Error loading active sections:', error);
      setSections([]);
    }
  }, []);

  useEffect(() => {
    loadActiveSections();
  }, [loadActiveSections]);

  useFocusEffect(
    React.useCallback(() => {
      loadActiveSections();
    }, [loadActiveSections])
  );

  useEffect(() => {
    const hasSelected = sections.length > 0;
    const animationConfig = { duration: 150 };
    flexWidth.value = withTiming(hasSelected ? 150 : 0, animationConfig);
    scale.value = withTiming(hasSelected ? 1 : 0, animationConfig);
    gap.value = withTiming(hasSelected ? 12 : 0, animationConfig);
  }, [sections, flexWidth, scale, gap]);

  const handleClearAll = useCallback(async () => {
    try {
      await Promise.all(Object.values(STORAGE_KEYS).map((key) => AsyncStorage.removeItem(key)));
      setSections([]);
    } catch (error) {
      console.error('Error clearing all filters:', error);
    }
  }, []);

  const removeItem = useCallback(
    async (item: Category) => {
      try {
        const storageKey = STORAGE_KEYS[item.type as keyof typeof STORAGE_KEYS];
        const savedState = await AsyncStorage.getItem(storageKey);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          parsedState[item.name] = false;
          await AsyncStorage.setItem(storageKey, JSON.stringify(parsedState));
          loadActiveSections(); // Reload the sections after removing the item
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },
    [loadActiveSections]
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

  const renderSectionHeader = ({ section: { title } }: { section: Section }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderItem = ({ item }: { item: Category }) => {
    const itemWidth = useSharedValue('100%');
    const itemOpacity = useSharedValue(1);
    const textSize = useSharedValue(14);

    const animatedStyles = useAnimatedStyle(() => ({
      width: itemWidth.value,
      opacity: itemOpacity.value,
    }));

    const animatedTextStyles = useAnimatedStyle(() => ({
      fontSize: textSize.value,
    }));

    const handleRemoveItem = () => {
      itemWidth.value = withTiming('0%', { duration: 300 }, () => {
        itemOpacity.value = withTiming(0, { duration: 150 }, () => {
          runOnJS(removeItem)(item);
        });
      });
      textSize.value = withTiming(0, { duration: 300 });
    };

    return (
      <TouchableOpacity onPress={handleRemoveItem} style={styles.deleteButton}>
        <Animated.View style={[styles.itemRow, animatedStyles]} layout={LinearTransition}>
          <Animated.Text style={[styles.itemText, animatedTextStyles]}>{item.name}</Animated.Text>
          <Ionicons name="close-outline" size={24} color={Colors.primary} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.type + item.name + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={
          <>
            <ItemBox />
            {sections.length > 0 && <Text style={styles.activeFiltersHeader}>Active Filters</Text>}
          </>
        }
        ListEmptyComponent={<Text style={styles.noFiltersText}>No active filters</Text>}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
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
              navigation.goBack();
            }}
          >
            <Text style={styles.footerText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
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
  itemContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  activeFiltersHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: Colors.primary,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: Colors.ultraLightGrey,
    padding: 8,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemText: {
    flex: 1,
    fontWeight: '400',
    fontFamily: 'Helvetica',
  },
  deleteButton: {},
  itemSeparator: {
    height: 5, // Space between rows
  },
  sectionSeparator: {
    height: 8, // Space between sections
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
  firstSubFilter: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 5,
    borderColor: Colors.grey,
    borderBottomWidth: 1,
  },
  middleSubFilter: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingLeft: 5,
    borderColor: Colors.grey,
    borderBottomWidth: 1,
  },
  lastSubFilter: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  subFilterText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Helvetica',
  },
  noFiltersText: {
    fontSize: 16,
    color: Colors.medium,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default Filter;
