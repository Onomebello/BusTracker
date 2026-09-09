import { StyleSheet, View } from "react-native";
import { theme } from "@/theme";

/**
 * A hairline separator inset to align with a row's text, not its leading
 * icon — pass the same `inset` the row's leading element occupies.
 */
export function Divider({ inset = 16 }: { inset?: number }) {
  return <View style={[styles.line, { marginLeft: inset }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.hairline,
  },
});
