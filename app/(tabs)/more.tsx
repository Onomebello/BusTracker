import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen, Header, Card, Row, Avatar, Button, IconSymbol } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { useSession } from "@/services/session";

export default function MoreScreen() {
  const { user, signOut } = useSession();

  return (
    <Screen>
      <View style={styles.profile}>
        <Avatar initials={initialsOf(user?.name ?? "?")} size={56} />
        <View style={styles.profileText}>
          <Text style={styles.name} allowFontScaling>
            {user?.name}
          </Text>
          <Text style={styles.email} allowFontScaling>
            {user?.email}
          </Text>
        </View>
      </View>

      <Header title="Trips" />
      <Card dividerInset={44}>
        <Row
          leading={<IconSymbol name="checkCircle" size={20} color={theme.tint} />}
          title="Attendance"
          onPress={() => router.push("/attendance")}
        />
        <Row
          leading={<IconSymbol name="history" size={20} color={theme.tint} />}
          title="Trip history"
          onPress={() => router.push("/trip-history")}
        />
      </Card>

      <Header title="Support" />
      <Card dividerInset={44}>
        <Row
          leading={<IconSymbol name="warningTriangle" size={20} color={theme.alert} />}
          title="Emergency"
          onPress={() => router.push("/emergency")}
        />
        <Row
          leading={<IconSymbol name="hand" size={20} color={theme.tint} />}
          title="Send feedback"
          onPress={() => router.push("/feedback")}
        />
      </Card>

      <Header title="Settings" />
      <Card dividerInset={44}>
        <Row
          leading={<IconSymbol name="bell" size={20} color={theme.tint} />}
          title="Notifications"
          onPress={() => router.push("/notifications")}
        />
        <Row
          leading={<IconSymbol name="gear" size={20} color={theme.tint} />}
          title="Preferences"
          onPress={() => router.push("/preferences")}
        />
      </Card>

      <View style={styles.signOut}>
        <Button title="Sign out" variant="destructive" onPress={signOut} />
      </View>
    </Screen>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`;
  return parts[0]?.slice(0, 2) ?? "?";
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileText: {
    gap: 2,
  },
  name: {
    fontSize: typography.headline.fontSize,
    fontWeight: "600",
    color: theme.ink,
  },
  email: {
    fontSize: typography.subhead.fontSize,
    color: theme.inkSoft,
  },
  signOut: {
    marginTop: spacing.xl,
    marginHorizontal: 16,
  },
});
