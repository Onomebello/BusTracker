import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/services/session";
import { theme } from "@/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SessionProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { isAuthenticated, user } = useSession();
  const profileComplete = user?.profileComplete ?? false;

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.tint as string,
        headerTitleStyle: { color: theme.ink as string },
      }}
    >
      <Stack.Protected guard={isAuthenticated && profileComplete}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="bus/[id]"
          options={{ title: "Bus", headerLargeTitle: false }}
        />
        <Stack.Screen
          name="student/[id]"
          options={{ title: "Student", headerLargeTitle: false }}
        />
        <Stack.Screen
          name="attendance"
          options={{ title: "Attendance", headerLargeTitle: true }}
        />
        <Stack.Screen
          name="trip-history"
          options={{ title: "Trip history", headerLargeTitle: true }}
        />
        <Stack.Screen
          name="emergency"
          options={{
            title: "Emergency",
            headerLargeTitle: true,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="feedback"
          options={{ title: "Feedback", headerLargeTitle: true }}
        />
        <Stack.Screen
          name="notifications"
          options={{ title: "Notifications", headerLargeTitle: true }}
        />
        <Stack.Screen
          name="preferences"
          options={{ title: "Preferences", headerLargeTitle: true }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && !profileComplete}>
        <Stack.Screen
          name="profile-setup"
          options={{ title: "Your details", headerBackVisible: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
