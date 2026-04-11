import { toastConfig } from "@/components/ui/ToastConfig";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const hasHandledInitialRoute = useRef(false);

  const [loaded, error] = useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Sansita-ExtraBoldItalic": require("../assets/fonts/Sansita-ExtraBoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const measurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID;
    if (!measurementId || typeof window === "undefined") {
      return;
    }

    if (!hasHandledInitialRoute.current) {
      hasHandledInitialRoute.current = true;
      return;
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#c4b5fd" },
        }}
      />
      <Toast config={toastConfig} />
    </>
  );
}
