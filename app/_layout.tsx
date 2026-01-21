import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BuddyProvider } from '../context/BuddyProvider';

/**
 * Root Layout
 * 
 * Wraps the entire app in BuddyProvider to enable live Rive animations
 * across all screens. The buddy will animate on app open automatically.
 */
export default function RootLayout() {
  return (
    <BuddyProvider autoOpenAnimation={true}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#E8E4F3' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="study-guide" />
        <Stack.Screen name="course" />
        <Stack.Screen name="assistant" />
      </Stack>
    </BuddyProvider>
  );
}