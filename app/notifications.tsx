import { StyleSheet, Text } from "react-native";
import { Screen, Header, Card, Row, IconSymbol } from "@/components";
import { theme, typography } from "@/theme";
import { useSession } from "@/services/session";
import { getStudentsForParent, getMessagesForBus } from "@/data/mock";
import { formatRelativeTime } from "@/utils/format";

export default function NotificationsScreen() {
  const { user } = useSession();
  const busId = getStudentsForParent(user?.id ?? "")[0]?.busId;
  const messages = busId ? getMessagesForBus(busId).slice().reverse() : [];

  if (messages.length === 0) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          No notifications yet.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Recent" />
      <Card dividerInset={44}>
        {messages.map((message) => (
          <Row
            key={message.id}
            leading={
              <IconSymbol
                name={message.senderRole === "driver" ? "bus" : "message"}
                size={20}
                color={message.senderRole === "driver" ? theme.bus : theme.tint}
              />
            }
            title={message.senderName}
            subtitle={message.body}
            value={formatRelativeTime(message.sentAt)}
            accessory="none"
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: typography.body.fontSize,
    color: theme.inkSoft,
    textAlign: "center",
    marginTop: 40,
  },
});
