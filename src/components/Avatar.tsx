import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "@/theme";

type AvatarProps = {
  initials: string;
  size?: number;
};

/** A neutral initials circle — never a photo placeholder colour, always slate. */
export function Avatar({ initials, size = 40 }: AvatarProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text
        style={[styles.initials, { fontSize: size * 0.38 }]}
        allowFontScaling
      >
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: theme.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: typography.headline.fontWeight,
    color: theme.inkSoft,
  },
});
