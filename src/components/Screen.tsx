import {
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type ViewStyle,
} from "react-native";
import type { PropsWithChildren, ReactElement } from "react";
import { theme } from "@/theme";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  refreshControl?: ReactElement<RefreshControlProps>;
}>;

/**
 * Base page background + optional scroll container. Native-stack headers
 * (large title, blur) handle the top inset on their own — this just owns
 * the body.
 */
export function Screen({
  children,
  scroll = true,
  padded = false,
  style,
  refreshControl,
}: ScreenProps) {
  if (!scroll) {
    return (
      <View style={[styles.root, padded && styles.padded, style]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padded && styles.padded, style]}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.paper,
  },
  content: {
    paddingBottom: 40,
  },
  padded: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
