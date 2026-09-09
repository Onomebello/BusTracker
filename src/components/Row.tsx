import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme, typography, layout } from "@/theme";
import { Divider } from "./Divider";
import { IconSymbol } from "./IconSymbol";

type RowAccessory = "chevron" | "none" | ReactNode;

export type RowProps = {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  accessory?: RowAccessory;
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** Set by Card on the final child so no divider renders underneath it. */
  isLast?: boolean;
  /** Set by Card so the divider aligns with this row's text. */
  dividerInset?: number;
};

export function Row({
  leading,
  title,
  subtitle,
  value,
  accessory = "chevron",
  destructive = false,
  disabled = false,
  onPress,
  isLast = false,
  dividerInset = 16,
}: RowProps) {
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.content}>
        <Text
          style={[styles.title, destructive && styles.destructiveText]}
          numberOfLines={1}
          allowFontScaling
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2} allowFontScaling>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={styles.value} numberOfLines={1} allowFontScaling>
          {value}
        </Text>
      ) : null}
      {renderAccessory(accessory)}
    </>
  );

  return (
    <View>
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.row,
            pressed && styles.pressed,
            disabled && styles.disabled,
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={[styles.row, disabled && styles.disabled]}>{content}</View>
      )}
      {!isLast ? <Divider inset={dividerInset} /> : null}
    </View>
  );
}

function renderAccessory(accessory: RowAccessory) {
  if (accessory === "none" || accessory == null) return null;
  if (accessory === "chevron") {
    return (
      <IconSymbol
        name="chevronRight"
        size={13}
        color={theme.inkFaint}
        style={styles.chevron}
      />
    );
  }
  return accessory;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: layout.rowMinHeight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: theme.surfaceElevated,
  },
  pressed: {
    backgroundColor: theme.paper,
  },
  disabled: {
    opacity: 0.5,
  },
  leading: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.ink,
  },
  destructiveText: {
    color: theme.alert,
  },
  subtitle: {
    fontSize: typography.footnote.fontSize,
    lineHeight: typography.footnote.lineHeight,
    color: theme.inkSoft,
  },
  value: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: theme.inkSoft,
  },
  chevron: {
    marginLeft: -2,
  },
});
