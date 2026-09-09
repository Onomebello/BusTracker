import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme, typography, radius, spacing } from "@/theme";
import { IconSymbol } from "./IconSymbol";
import type { BusStatus } from "@/services/tracking";
import { formatEtaMinutesValue } from "@/utils/format";

type EtaHeroProps = {
  stopName: string;
  etaSeconds: number | null;
  status: BusStatus | null;
  onPress?: () => void;
};

/**
 * The one loud, dark element in an otherwise quiet app — how many minutes
 * until the bus reaches this stop. Amber marks the bus, green marks that
 * we're watching it live right now; nothing else on the card gets colour.
 */
export function EtaHero({ stopName, etaSeconds, status, onPress }: EtaHeroProps) {
  const isLive = status === "en_route" || status === "at_stop";
  const isFinished = status === "finished";

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.busBadge}>
          <IconSymbol name="bus" size={16} color={theme.bus} />
        </View>
        {isLive ? (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText} allowFontScaling>
              Live
            </Text>
          </View>
        ) : null}
      </View>

      {isFinished ? (
        <Text style={styles.finishedText} allowFontScaling>
          Trip finished
        </Text>
      ) : etaSeconds === null ? (
        <Text style={styles.finishedText} allowFontScaling>
          Waiting for the bus to start
        </Text>
      ) : (
        <View style={styles.valueRow}>
          <Text style={styles.value} allowFontScaling>
            {formatEtaMinutesValue(etaSeconds)}
          </Text>
          <Text style={styles.unit} allowFontScaling>
            min
          </Text>
        </View>
      )}

      <Text style={styles.caption} allowFontScaling>
        {isFinished
          ? `Last stop was ${stopName}`
          : `until the bus reaches ${stopName}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: theme.ink,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  busBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.live,
  },
  liveText: {
    fontSize: typography.caption1.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  value: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  unit: {
    fontSize: typography.title2.fontSize,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
  },
  finishedText: {
    fontSize: typography.title2.fontSize,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 4,
  },
  caption: {
    fontSize: typography.subhead.fontSize,
    color: "rgba(255,255,255,0.7)",
  },
});
