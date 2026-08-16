import '@/global.css';

import { AppDrawer } from '@/src/components/navigation/AppDrawer';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import { initI18n } from '@/src/localization';
import { ThemeProvider as HomePalThemeProvider, ThemeMode } from '@/src/providers/ThemeProvider';
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
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { I18nManager, LogBox } from 'react-native';
import { Provider } from 'react-redux';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(true); // Hides the broken RTL warning toasts from the UI (warnings still show in terminal)

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
  const [initialThemeMode, setInitialThemeMode] = useState<ThemeMode>('system');
  const [themeLoaded, setThemeLoaded] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  // One-time bootstrap. Deliberately has no dependencies: it must run exactly once.
  // Keying it on the OS colour scheme (as it was) re-ran the whole thing — including a
  // redundant SecureStore read — every time the system flipped between light and dark.
  useEffect(() => {
    async function prepare() {
      try {
        await initI18n();

        const savedTheme = await SecureStore.getItemAsync('HOMEPAL_THEME_MODE');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setInitialThemeMode(savedTheme);
        }
      } catch (err) {
        console.warn('[RootLayout] Error initializing app:', err);
      } finally {
        setI18nInitialized(true);
        setThemeLoaded(true);
      }
    }
    prepare();
  }, []);

  const appIsReady = (fontsLoaded || fontError) && i18nInitialized && themeLoaded;

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const stackAnimation = I18nManager.isRTL ? 'slide_from_left' : 'slide_from_right';

  // Hold the tree until the persisted theme has been read. ThemeProvider seeds its state
  // from `initialMode` via useState, which ignores later prop changes — so it has to
  // mount already knowing the right value. The native splash is still up here.
  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <HomePalThemeProvider initialMode={initialThemeMode}>
          <ToastProvider>
            <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
              <BottomSheetModalProvider>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <SessionBootstrapper />
                <AppDrawer>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: stackAnimation,
                      contentStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#121413' : '#FAF8F3',
                      },
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
              </BottomSheetModalProvider>
            </NavigationThemeProvider>
          </ToastProvider>
        </HomePalThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
