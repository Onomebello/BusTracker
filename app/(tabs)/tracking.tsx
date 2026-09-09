import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen, Header, Card, Row, Pill, IconSymbol, RouteMap } from "@/components";
import { theme, typography, spacing } from "@/theme";
import { useSession } from "@/services/session";
import { useBusPosition } from "@/hooks/useBusPosition";
import { getStudentsForParent, getBus, getStopsForRoute } from "@/data/mock";
import { projectedEtaSeconds, type BusStatus } from "@/services/tracking";
import { formatEtaMinutes, formatSpeed } from "@/utils/format";

const STATUS_LABEL: Record<BusStatus, string> = {
  not_started: "Not started",
  en_route: "En route",
  at_stop: "At stop",
  finished: "Finished",
};

export default function TrackingScreen() {
  const { user } = useSession();
  const busId = useMemo(
    () => getStudentsForParent(user?.id ?? "")[0]?.busId,
    [user?.id],
  );
  const bus = busId ? getBus(busId) : undefined;
  const stopList = bus ? getStopsForRoute(bus.routeId) : [];
  const position = useBusPosition(bus?.id);

  if (!bus || stopList.length === 0) {
    return (
      <Screen padded>
        <Text style={styles.empty} allowFontScaling>
          No route assigned yet.
        </Text>
      </Screen>
    );
  }

  const isLive = position?.status === "en_route" || position?.status === "at_stop";

  return (
    <Screen>
      <RouteMap stopList={stopList} position={position} busPlate={bus.plateNumber} />

      <View style={styles.statusRow}>
        <Pill
          label={position ? STATUS_LABEL[position.status] : "Loading"}
          tone={isLive ? "live" : "neutral"}
        />
        {position?.status === "en_route" ? (
          <Text style={styles.speed} allowFontScaling>
            {formatSpeed(position.speedKph)}
          </Text>
        ) : null}
      </View>

      <Header title="Route" />
      <Card dividerInset={44}>
        {stopList.map((stop, index) => {
          const passed =
            position && (position.status === "finished" || index < position.nextStopIndex);
          return (
            <Row
              key={stop.id}
              leading={
                <IconSymbol
                  name={passed ? "checkCircle" : "pin"}
                  size={20}
                  color={passed ? theme.inkFaint : theme.bus}
                />
              }
              title={stop.name}
              value={
                !position
                  ? undefined
                  : passed
                    ? "Passed"
                    : formatEtaMinutes(projectedEtaSeconds(position, index))
              }
              accessory="none"
              isLast={index === stopList.length - 1}
            />
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: spacing.sm,
  },
  speed: {
    fontSize: typography.subhead.fontSize,
    color: theme.inkSoft,
  },
  empty: {
    fontSize: typography.body.fontSize,
    color: theme.inkSoft,
    textAlign: "center",
    marginTop: 40,
  },
});
