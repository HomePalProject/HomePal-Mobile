import '@/global.css';

import { LoadingScreen } from '@/src/components/common/LoadingScreen';
import { AppDrawer } from '@/src/components/navigation/AppDrawer';
import { useProtectedRoute } from '@/src/hooks/useProtectedRoute';
import { initI18n } from '@/src/localization';
import { ThemeProvider as HomePalThemeProvider, ThemeMode } from '@/src/providers/ThemeProvider';
import { ToastProvider } from '@/src/providers/ToastProvider';
import { store, useAppDispatch, useAppSelector } from '@/src/store';
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
import { I18nManager, LogBox, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs(true);

const STACK_ANIMATION = I18nManager.isRTL ? 'slide_from_left' : 'slide_from_right';

function SessionBootstrapper() {
  const dispatch = useAppDispatch();

  useProtectedRoute();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return null;
}

function BootstrapOverlay() {
  const isBootstrapped = useAppSelector((state) => state.auth.isBootstrapped);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isBootstrapped) return;
    const timer = setTimeout(() => setShowLoader(true), 150);
    return () => clearTimeout(timer);
  }, [isBootstrapped]);

  if (isBootstrapped || !showLoader) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <LoadingScreen />
    </View>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [initialThemeMode, setInitialThemeMode] = useState<ThemeMode>('system');
  const [shellReady, setShellReady] = useState(false);

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

        const savedTheme = await SecureStore.getItemAsync('HOMEPAL_THEME_MODE');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setInitialThemeMode(savedTheme);
        }
      } catch (err) {
        console.warn('[RootLayout] Error initializing app:', err);
      } finally {
        setShellReady(true);
      }
    }
    prepare();
  }, []);

  const appIsReady = (fontsLoaded || fontError) && shellReady;

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

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
                      animation: STACK_ANIMATION,
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
                <BootstrapOverlay />
                <PortalHost />
              </BottomSheetModalProvider>
            </NavigationThemeProvider>
          </ToastProvider>
        </HomePalThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
