import { StyleSheet, Text, View } from "react-native";
import { IconSymbol } from "./IconSymbol";
import { theme, typography, spacing } from "@/theme";
import type { BusPosition } from "@/services/tracking";
import type { Stop } from "@/data/mock";

type RouteMapProps = {
  stopList: Stop[];
  position: BusPosition | null;
  busPlate: string;
};

/**
 * react-native-maps has no web target, so the web build gets a schematic
 * line-of-stops visual (this file) instead of the interactive native map.
 */
export function RouteMap({ stopList, position, busPlate }: RouteMapProps) {
  const progress = busProgress(stopList.length, position);
  const isPassed = (index: number) =>
    position != null &&
    (position.status === "finished" || index < position.nextStopIndex);

  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <View style={styles.stopsRow}>
        {stopList.map((stop, index) => (
          <View
            key={stop.id}
            style={[styles.stopDot, isPassed(index) && styles.stopDotPassed]}
          />
        ))}
      </View>
      {progress !== null ? (
        <View style={[styles.busWrap, { left: `${progress * 100}%` }]}>
          <View style={styles.busBadge}>
            <IconSymbol name="bus" size={14} color="#FFFFFF" />
          </View>
        </View>
      ) : null}
      <Text style={styles.caption} allowFontScaling>
        {busPlate} · open the mobile app for the live map
      </Text>
    </View>
  );
}

function busProgress(stopCount: number, position: BusPosition | null): number | null {
  if (!position || stopCount < 2) return null;
  const legs = stopCount - 1;
  if (position.status === "not_started") return 0;
  if (position.status === "finished") return 1;
  if (position.status === "at_stop") return position.nextStopIndex / legs;
  return (position.nextStopIndex - 0.5) / legs;
}

const styles = StyleSheet.create({
  wrap: {
    height: 260,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: theme.surfaceElevated,
  },
  line: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
    top: "50%",
    height: 2,
    backgroundColor: theme.hairlineOpaque,
  },
  stopsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.tint,
    borderWidth: 2,
    borderColor: theme.surfaceElevated,
  },
  stopDotPassed: {
    backgroundColor: theme.inkFaint,
  },
  busWrap: {
    position: "absolute",
    top: "50%",
    marginTop: -14,
    marginLeft: -14,
  },
  busBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.bus,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.surfaceElevated,
  },
  caption: {
    position: "absolute",
    bottom: spacing.sm,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: typography.caption1.fontSize,
    color: theme.inkFaint,
  },
});
