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
        <Stack
          screenOptions={{
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="home"
            options={{
              header: () => <CustomHeader />,
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
            }}
          />

          <Stack.Screen
            name="share_location"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(modal)/(filter)/filter_hub"
            options={{
              headerTitle: 'Filter',
              presentation: 'modal',
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
            name="(modal)/(filter)/filter_dishes"
            options={{
              headerTitle: 'Dishes',
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/(filter)/filter_ingredients"
            options={{
              headerTitle: 'Ingredients',
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/(filter)/filter_allergens"
            options={{
              headerTitle: 'Allergens',
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/(filter)/filter_meal_times"
            options={{
              headerTitle: 'Meal Time',
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/(filter)/filter_locations"
            options={{
              headerTitle: 'Locations',
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Colors.ultraLightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color={Colors.primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/location_search"
            options={{
              headerTitle: 'Select location',
              presentation: 'fullScreenModal',
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
