import '@/global.css';

import { AppDrawer } from '@/src/components/navigation/AppDrawer';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import { initI18n } from '@/src/localization';
import { ThemeProvider as HomePalThemeProvider } from '@/src/providers/ThemeProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';
import { store, useAppDispatch } from '@/src/store';
import { bootstrapAuth } from '@/src/store/slices/authSlice';
import { NAV_THEME } from '@/src/theme';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts,
} from '@expo-google-fonts/cairo';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { ThemeProvider as NavigationThemeProvider } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Provider } from 'react-redux';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function SessionBootstrapper() {
  const dispatch = useAppDispatch();
  useProtectedRoute();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [i18nInitialized, setI18nInitialized] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initI18n();
      } catch (err) {
        console.warn('[RootLayout] Error initializing i18n:', err);
      } finally {
        setI18nInitialized(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && i18nInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, i18nInitialized]);

  const stackAnimation = I18nManager.isRTL ? 'slide_from_left' : 'slide_from_right';

  return (
    <Provider store={store}>
      <HomePalThemeProvider>
        <ToastProvider>
          <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <SessionBootstrapper />
            <AppDrawer>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: stackAnimation,
                  contentStyle: { backgroundColor: colorScheme === 'dark' ? '#121413' : '#FAF8F3' },
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(households)" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="edit-profile" />
              </Stack>
            </AppDrawer>
            <PortalHost />
          </NavigationThemeProvider>
        </ToastProvider>
      </HomePalThemeProvider>
    </Provider>
  );
}
