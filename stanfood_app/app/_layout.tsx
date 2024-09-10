import { Stack, useNavigation } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayoutNav() {
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              header: () => <CustomHeader />,
            }}
          />
          <Stack.Screen
            name="(modal)/filter_hub"
            options={{
              headerTitle: 'Filter',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter_dishes"
            options={{
              headerTitle: 'Dishes',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter_ingredients"
            options={{
              headerTitle: 'Ingredients',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter_allergens"
            options={{
              headerTitle: 'Allergens',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter_meal_times"
            options={{
              headerTitle: 'Meal Time',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter_locations"
            options={{
              headerTitle: 'Locations',
              presentation: 'modal',
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="close-outline" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
