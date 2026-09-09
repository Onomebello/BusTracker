import { StyleSheet, Text, TextInput, View } from "react-native";
import type { ComponentProps } from "react";
import { theme, typography, layout } from "@/theme";
import { Divider } from "./Divider";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isLast?: boolean;
  dividerInset?: number;
} & Pick<
  ComponentProps<typeof TextInput>,
  | "secureTextEntry"
  | "keyboardType"
  | "autoCapitalize"
  | "autoCorrect"
  | "returnKeyType"
  | "textContentType"
  | "autoComplete"
>;

/**
 * A labelled text input styled as a grouped-list row, e.g. inside a Card
 * on the login / signup / profile-setup screens.
 */
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  isLast = false,
  dividerInset = 16,
  ...inputProps
}: FieldProps) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label} allowFontScaling>
          {label}
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.inkFaint}
          allowFontScaling
          {...inputProps}
        />
      </View>
      {!isLast ? <Divider inset={dividerInset} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: layout.rowMinHeight,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: theme.surfaceElevated,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: theme.ink,
    width: 96,
  },
  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: theme.ink,
    paddingVertical: 10,
  },
});
