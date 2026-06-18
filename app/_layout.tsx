import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";

import BottomNavigation from "@/components/bottom-navigation";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "🚀 Expo Lab",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="gps"
            options={{
              title: "📍 GPS (Location)",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="camera"
            options={{
              title: "📷 Caméra",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="storage"
            options={{
              title: "💾 Storage",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="api"
            options={{
              title: "🐱 API (Chat)",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="maps"
            options={{
              title: "🗺️ Maps",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="light-sensor"
            options={{
              title: "💡 Capteur de Luminosité",
              headerShown: true,
            }}
          />
        </Stack>
        <BottomNavigation />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
