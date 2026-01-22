import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';
import { WorkerProvider } from '../contexts/WorkerContext';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
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
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WorkerProvider>
          <RootLayoutNav />
        </WorkerProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
