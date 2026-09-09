import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconSymbol } from "@/components";
import { theme, typography, radius, spacing } from "@/theme";
import { useSession } from "@/services/session";
import {
  getStudentsForParent,
  getMessagesForBus,
  type Message,
} from "@/data/mock";
import { formatClockTime } from "@/utils/format";

export default function ChatScreen() {
  const { user } = useSession();
  const busId = useMemo(
    () => getStudentsForParent(user?.id ?? "")[0]?.busId,
    [user?.id],
  );
  const [extra, setExtra] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const messages = useMemo(
    () => [...(busId ? getMessagesForBus(busId) : []), ...extra],
    [busId, extra],
  );

  function send() {
    const body = draft.trim();
    if (!body || !busId) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        busId,
        senderId: user?.id ?? "parent-1",
        senderName: "You",
        senderRole: "parent",
        body,
        sentAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message the driver…"
          placeholderTextColor={theme.inkFaint}
          multiline
          allowFontScaling
        />
        <Pressable
          onPress={send}
          disabled={draft.trim().length === 0}
          style={({ pressed }) => [
            styles.sendButton,
            draft.trim().length === 0 && styles.sendButtonDisabled,
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol name="send" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message }: { message: Message }) {
  const isMine = message.senderRole === "parent";
  return (
    <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
      <View
        style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}
      >
        {!isMine ? (
          <Text style={styles.sender} allowFontScaling>
            {message.senderName}
          </Text>
        ) : null}
        <Text style={[styles.body, isMine && styles.bodyMine]} allowFontScaling>
          {message.body}
        </Text>
      </View>
      <Text style={[styles.time, isMine && styles.timeMine]} allowFontScaling>
        {formatClockTime(message.sentAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.paper,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  bubbleRow: {
    alignItems: "flex-start",
    maxWidth: "80%",
  },
  bubbleRowMine: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  bubbleTheirs: {
    backgroundColor: theme.surfaceElevated,
    borderTopLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: theme.tint,
    borderTopRightRadius: 4,
  },
  sender: {
    fontSize: typography.caption1.fontSize,
    fontWeight: "600",
    color: theme.inkSoft,
  },
  body: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.ink,
  },
  bodyMine: {
    color: theme.surface,
  },
  time: {
    fontSize: typography.caption2.fontSize,
    color: theme.inkFaint,
    marginTop: 2,
    marginHorizontal: 4,
  },
  timeMine: {
    textAlign: "right",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: 16,
    paddingVertical: spacing.sm,
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.hairline,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: typography.body.fontSize,
    color: theme.ink,
    backgroundColor: theme.surfaceElevated,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: theme.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
