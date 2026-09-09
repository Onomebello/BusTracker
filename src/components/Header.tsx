import { StyleSheet, Text, View } from "react-native";
import { theme, typography } from "@/theme";

/**
 * A grouped-list section header: footnote size, secondaryLabel colour,
 * sitting above a Card. Not the navigation bar title — expo-router's
 * native-stack owns that via headerLargeTitle.
 */
export function Header({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text} allowFontScaling>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 6,
  },
  text: {
    fontSize: typography.footnote.fontSize,
    lineHeight: typography.footnote.lineHeight,
    color: theme.inkSoft,
  },
});
