import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { theme, typography, radius } from "@/theme";

export type ButtonVariant = "primary" | "plain" | "destructive";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * "primary" is filled tint and reserved for the screen's one main action.
 * Everything else stays borderless tinted (or red) text, per HIG.
 */
export function Button({
  title,
  onPress,
  variant = "plain",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const textColor =
    variant === "destructive"
      ? theme.alert
      : isPrimary
        ? theme.surface
        : theme.tint;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        isPrimary && styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: textColor },
            isPrimary && styles.primaryLabel,
          ]}
          allowFontScaling
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: theme.tint,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    textAlign: "center",
  },
  primaryLabel: {
    fontWeight: "600",
  },
});
