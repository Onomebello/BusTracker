import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { theme, radius } from "@/theme";
import { Row, type RowProps } from "./Row";

type CardProps = {
  children: ReactNode;
  /** Inset the internal dividers to, e.g. 52 when every Row has a leading icon. */
  dividerInset?: number;
};

/**
 * An inset grouped table section — the Apple Settings-style rounded block.
 * Stacks Row children and inserts the dividers between them (never after
 * the last one) so screens don't hand-roll separator logic.
 */
export function Card({ children, dividerInset = 16 }: CardProps) {
  const items = Children.toArray(children);

  return (
    <View style={styles.card}>
      {items.map((child, index) => {
        if (!isValidElement<RowProps>(child) || child.type !== Row) {
          return child;
        }
        return cloneElement(child, {
          key: child.key ?? index,
          isLast: index === items.length - 1,
          dividerInset: child.props.dividerInset ?? dividerInset,
        });
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: theme.surfaceElevated,
  },
});
