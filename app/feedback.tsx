import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Screen, Button } from "@/components";
import { theme, typography, radius, spacing } from "@/theme";

export default function FeedbackScreen() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <Screen padded>
      <Text style={styles.intro} allowFontScaling>
        Tell us what's working and what isn't. We read every message.
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => {
            setMessage(text);
            setSent(false);
          }}
          placeholder="Type your feedback…"
          placeholderTextColor={theme.inkFaint}
          multiline
          allowFontScaling
        />
      </View>

      <View style={styles.actions}>
        <Button
          title={sent ? "Sent — thank you" : "Send feedback"}
          variant="primary"
          disabled={message.trim().length === 0}
          onPress={() => {
            setSent(true);
            setMessage("");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.inkSoft,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.md,
    backgroundColor: theme.surfaceElevated,
    minHeight: 140,
    padding: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: theme.ink,
    textAlignVertical: "top",
  },
  actions: {
    marginTop: spacing.xl,
  },
});
