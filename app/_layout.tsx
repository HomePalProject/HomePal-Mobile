import '@/global.css';

import { useEffect } from 'react';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import * as SplashScreen from 'expo-splash-screen';
import { NAV_THEME } from '@/src/theme';
import { ThemeProvider as NavigationThemeProvider } from 'expo-router/react-navigation';
import { ThemeProvider as HomePalThemeProvider } from '@/src/providers/ThemeProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from '@/src/store';
import { bootstrapAuth } from '@/src/store/slices/authSlice';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function SessionBootstrapper() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <HomePalThemeProvider>
        <ToastProvider>
          <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <SessionBootstrapper />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colorScheme === 'dark' ? '#121413' : '#FAF8F3' },
              }}
            />
            <PortalHost />
          </NavigationThemeProvider>
        </ToastProvider>
      </HomePalThemeProvider>
    </Provider>
  );
}
