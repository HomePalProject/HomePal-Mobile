import '@/global.css';

import { NAV_THEME } from '@/src/theme';
import { ThemeProvider as NavigationThemeProvider } from 'expo-router/react-navigation';
import { ThemeProvider as HomePalThemeProvider } from '@/src/providers/ThemeProvider';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <HomePalThemeProvider>
      <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack />
        <PortalHost />
      </NavigationThemeProvider>
    </HomePalThemeProvider>
  );
}
