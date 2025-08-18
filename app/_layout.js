import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Onboarding' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="chat" options={{ title: 'Chat' }} />
    </Stack>
  );
}