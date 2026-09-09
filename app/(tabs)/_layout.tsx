import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { IconSymbol } from "@/components";
import { theme } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTintColor: theme.tint as string,
        headerTitleStyle: { color: theme.ink as string },
        tabBarActiveTintColor: theme.tint as string,
        tabBarInactiveTintColor: theme.inkFaint as string,
        tabBarStyle: Platform.OS === "ios" ? { position: "absolute" } : undefined,
        tabBarBackground:
          Platform.OS === "ios"
            ? () => (
                <BlurView
                  intensity={80}
                  tint="systemChromeMaterial"
                  style={{ flex: 1 }}
                />
              )
            : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tracking",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="tracking" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="more" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
