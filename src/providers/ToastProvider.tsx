import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { View, Animated, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/ui/text';
import { Icon } from '@/src/components/ui/icon';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { lightColors, darkColors } from '@/src/theme/colors';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 3500
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Global listener for non-React usage (e.g., API client / Axios interceptors)
type ToastListener = (options: ToastOptions) => void;
let globalToastListener: ToastListener | null = null;

export const toast = {
  show: (options: ToastOptions) => {
    if (globalToastListener) globalToastListener(options);
  },
  success: (title: string, message?: string) => {
    if (globalToastListener) globalToastListener({ type: 'success', title, message });
  },
  error: (title: string, message?: string) => {
    if (globalToastListener) globalToastListener({ type: 'error', title, message });
  },
  info: (title: string, message?: string) => {
    if (globalToastListener) globalToastListener({ type: 'info', title, message });
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? darkColors : lightColors;
  const [toastData, setToastData] = useState<ToastOptions | null>(null);
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastData(null);
    });
  };

  const showToast = (options: ToastOptions) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToastData(options);

    // Reset positions
    slideAnim.setValue(-150);
    opacityAnim.setValue(0);

    // Animate in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const duration = options.duration || 3500;
    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  };

  useEffect(() => {
    globalToastListener = showToast;
    return () => {
      globalToastListener = null;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getToastColors = (type?: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-surface-surface',
          borderColor: themeColors.brand.success,
          iconColor: 'text-status-success',
          icon: CheckCircle2,
          accentBg: 'bg-status-success/15',
        };
      case 'error':
        return {
          bg: 'bg-surface-surface',
          borderColor: themeColors.brand.error,
          iconColor: 'text-status-error',
          icon: AlertCircle,
          accentBg: 'bg-status-error/15',
        };
      case 'info':
      default:
        return {
          bg: 'bg-surface-surface',
          borderColor: themeColors.brand.info,
          iconColor: 'text-status-info',
          icon: Info,
          accentBg: 'bg-status-info/15',
        };
    }
  };

  const currentStyle = getToastColors(toastData?.type);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastData && (
        <Animated.View
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? Math.max(insets.top, 20) + 10 : insets.top + 16,
            left: 16,
            right: 16,
            zIndex: 99999,
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }}
          className="pointer-events-box-none">
          <Pressable
            onPress={hideToast}
            style={{ borderColor: currentStyle.borderColor, borderWidth: 2 }}
            className={`flex-row items-center gap-3.5 rounded-2xl ${currentStyle.bg} p-4 shadow-lg shadow-black/15`}>
            <View
              className={`h-10 w-10 items-center justify-center rounded-full ${currentStyle.accentBg}`}>
              <Icon as={currentStyle.icon} size={22} color={currentStyle.borderColor} />
            </View>
            <View className="flex-1 flex-col justify-center">
              <Text className="font-cairo text-[15px] font-bold leading-tight text-text-primary">
                {toastData.title}
              </Text>
              {toastData.message ? (
                <Text className="mt-0.5 font-cairo text-[13px] font-normal leading-snug text-text-secondary">
                  {toastData.message}
                </Text>
              ) : null}
            </View>
            <Pressable onPress={hideToast} className="p-1">
              <Icon as={X} size={18} className="text-text-disabled" />
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
