import { Stack } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}
