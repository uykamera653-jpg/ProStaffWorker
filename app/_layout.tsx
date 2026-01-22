import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WorkerProvider } from '../contexts/WorkerContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WorkerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="order/[id]" 
            options={{ 
              headerShown: true,
              title: 'Buyurtma tafsilotlari',
              presentation: 'modal'
            }} 
          />
        </Stack>
      </WorkerProvider>
    </SafeAreaProvider>
  );
}
