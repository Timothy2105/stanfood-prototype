import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'none' : 'fade', // Disable animations on iOS; use fade on Android
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="menu"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}